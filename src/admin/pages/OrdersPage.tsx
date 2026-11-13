import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { cn } from '@/shared/lib/utils'
import { PageHeader } from '../components/form'
import { StatusBadge } from '../components/StatusBadge'
import { ORDER_STATUSES, STATUS_LABEL, formatDate, money } from '../lib/orders'
import { adminService, errorMessage } from '../services/admin.service'
import type { OrderQuery, OrderStatus } from '../types'

/** Filters live in the URL, so a refresh or the back button keeps them. */
export function OrdersPage() {
  const [params, setParams] = useSearchParams()
  const query: OrderQuery = {
    status: (params.get('status') as OrderStatus) || undefined,
    q: params.get('q') || undefined,
    from: params.get('from') || undefined,
    to: params.get('to') || undefined,
    page: Number(params.get('page')) || 1,
  }
  const [search, setSearch] = useState(query.q ?? '')

  const orders = useQuery({
    queryKey: ['admin', 'orders', query],
    queryFn: () => adminService.orders(query),
    placeholderData: keepPreviousData,
  })

  function update(changes: Partial<Record<keyof OrderQuery, string | number | undefined>>) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined || value === '') next.delete(key)
      else next.set(key, String(value))
    }
    if (!('page' in changes)) next.delete('page')
    setParams(next)
  }

  const counts = orders.data?.counts ?? {}
  const all = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0)

  return (
    <>
      <PageHeader title="الأوردرات">
        <Button variant="outline" size="sm" onClick={() => orders.refetch()} disabled={orders.isFetching}>
          <RefreshCw className={cn('size-4', orders.isFetching && 'animate-spin')} />
          تحديث
        </Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        {[undefined, ...ORDER_STATUSES].map((s) => (
          <button
            key={s ?? 'all'}
            type="button"
            onClick={() => update({ status: s })}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              query.status === s ? 'border-forest bg-forest text-on-forest' : 'border-line bg-surface hover:border-line-strong',
            )}
          >
            {s ? STATUS_LABEL[s] : 'الكل'}
            <span className="spec opacity-70">{s ? (counts[s] ?? 0) : all}</span>
          </button>
        ))}
      </div>

      <form
        className="mb-4 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          update({ q: search.trim() })
        }}
      >
        <label className="grid gap-1 text-sm">
          بحث
          <Input
            placeholder="رقم الأوردر، الاسم أو الموبايل"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-72 max-w-full bg-surface"
          />
        </label>
        <label className="grid gap-1 text-sm">
          من
          <Input type="date" value={query.from ?? ''} onChange={(e) => update({ from: e.target.value })} className="h-10 bg-surface" />
        </label>
        <label className="grid gap-1 text-sm">
          إلى
          <Input type="date" value={query.to ?? ''} onChange={(e) => update({ to: e.target.value })} className="h-10 bg-surface" />
        </label>
        <Button type="submit" size="sm" variant="secondary">
          بحث
        </Button>
        {(query.q || query.from || query.to) && (
          <button
            type="button"
            className="cursor-pointer pb-2 text-sm underline"
            onClick={() => {
              setSearch('')
              update({ q: undefined, from: undefined, to: undefined })
            }}
          >
            امسح الفلاتر
          </button>
        )}
      </form>

      {orders.isPending ? (
        <p className="text-ink-muted">جاري التحميل…</p>
      ) : orders.isError ? (
        <p className="text-danger">{errorMessage(orders.error)}</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">الأوردر</TableHead>
                  <TableHead className="text-start">العميل</TableHead>
                  <TableHead className="text-start">المحافظة</TableHead>
                  <TableHead className="text-start">القطع</TableHead>
                  <TableHead className="text-start">الإجمالي</TableHead>
                  <TableHead className="text-start">الحالة</TableHead>
                  <TableHead className="text-start">التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.items.map((o) => (
                  <TableRow key={o.number} className="cursor-pointer">
                    <TableCell>
                      <Link to={`/admin/orders/${o.number}`} className="spec text-sm font-semibold text-ink hover:text-ember-ink">
                        #{o.number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin/orders/${o.number}`} className="grid">
                        <span className="font-medium">{o.customer.name}</span>
                        <span className="spec text-ink-muted">{o.customer.phone}</span>
                      </Link>
                    </TableCell>
                    <TableCell>{o.customer.governorate}</TableCell>
                    <TableCell>{o.items.reduce((n, i) => n + i.qty, 0)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {money(o.total)}
                      {o.shippingFee == null && <span className="block text-xs text-ink-muted">من غير شحن</span>}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={o.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-ink-muted">{formatDate(o.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {orders.data.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-ink-muted">
                      مفيش أوردرات
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {orders.data.pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" disabled={orders.data.page <= 1} onClick={() => update({ page: orders.data.page - 1 })}>
                السابق
              </Button>
              <span className="text-sm text-ink-muted">
                صفحة {orders.data.page} من {orders.data.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={orders.data.page >= orders.data.pages}
                onClick={() => update({ page: orders.data.page + 1 })}
              >
                التالي
              </Button>
            </div>
          )}
        </>
      )}
    </>
  )
}
