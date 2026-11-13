import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { PageHeader, Section } from '../components/form'
import { StatusBadge } from '../components/StatusBadge'
import { ORDER_STATUSES, STATUS_LABEL, formatDate, money } from '../lib/orders'
import { adminService, errorMessage } from '../services/admin.service'

const PERIODS = [
  { key: 'today', label: 'النهارده' },
  { key: 'week', label: 'آخر ٧ أيام' },
  { key: 'month', label: 'الشهر ده' },
] as const

/** Dashboard home: sales, orders waiting for action, best sellers and sizes running out. */
export function OverviewPage() {
  const stats = useQuery({ queryKey: ['admin', 'stats'], queryFn: adminService.stats })

  if (stats.isPending) return <p className="text-ink-muted">جاري التحميل…</p>
  if (stats.isError) return <p className="text-danger">{errorMessage(stats.error)}</p>

  const s = stats.data
  const waiting = s.byStatus.new ?? 0

  return (
    <div className="grid gap-6">
      <PageHeader title="نظرة عامة">
        <Button variant="outline" size="sm" onClick={() => stats.refetch()} disabled={stats.isFetching}>
          <RefreshCw className={cn('size-4', stats.isFetching && 'animate-spin')} />
          تحديث
        </Button>
      </PageHeader>

      {waiting > 0 && (
        <Link
          to="/admin/orders?status=new"
          className="flex items-center justify-between gap-3 rounded-lg bg-ember-tint px-5 py-4 text-ember-ink hover:bg-ember-tint/70"
        >
          <span className="font-semibold">عندك {waiting} أوردر جديد مستني تأكيد</span>
          <span className="text-sm underline">شوفهم</span>
        </Link>
      )}

      <section aria-label="المبيعات" className="grid gap-3 sm:grid-cols-3">
        {PERIODS.map((p) => (
          <div key={p.key} className="rounded-lg border border-line bg-surface p-5">
            <p className="text-sm text-ink-muted">مبيعات {p.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{money(s.sales[p.key].revenue)}</p>
            <p className="text-sm text-ink-muted">{s.sales[p.key].orders} أوردر</p>
          </div>
        ))}
      </section>
      <p className="-mt-3 text-xs text-ink-muted">المبيعات بتحسب الأوردرات المتأكدة واللي اتشحنت واتسلّمت، من غير الشحن.</p>

      <div className="flex flex-wrap gap-2">
        {ORDER_STATUSES.map((status) => (
          <Link
            key={status}
            to={`/admin/orders?status=${status}`}
            className="flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm hover:border-line-strong"
          >
            {STATUS_LABEL[status]} <span className="spec opacity-70">{s.byStatus[status] ?? 0}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="أحدث الأوردرات">
          {s.latest.length === 0 ? (
            <p className="text-sm text-ink-muted">لسه مفيش أوردرات.</p>
          ) : (
            <ul className="grid divide-y divide-line">
              {s.latest.map((o) => (
                <li key={o.number}>
                  <Link to={`/admin/orders/${o.number}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-ember-ink">
                    <span className="grid">
                      <span className="font-medium">{o.customer.name}</span>
                      <span className="spec text-ink-muted">
                        #{o.number} · {formatDate(o.createdAt)}
                      </span>
                    </span>
                    <span className="grid justify-items-end gap-1">
                      <span className="whitespace-nowrap">{money(o.subtotal)}</span>
                      <StatusBadge status={o.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="الأكثر مبيعاً">
          {s.topProducts.length === 0 ? (
            <p className="text-sm text-ink-muted">هيظهر هنا أول ما تأكد أوردرات.</p>
          ) : (
            <ol className="grid gap-3">
              {s.topProducts.map((p, i) => (
                <li key={p.productId} className="grid grid-cols-[24px_44px_1fr_auto] items-center gap-3">
                  <span className="spec text-ink-muted">{i + 1}</span>
                  {p.photo ? <img src={p.photo} alt="" className="size-11 rounded-md object-cover" /> : <span className="size-11 rounded-md bg-surface-sunken" />}
                  <Link to={`/admin/products/${p.productId}`} className="font-medium hover:text-ember-ink">
                    {p.name.ar}
                  </Link>
                  <span className="text-end text-sm whitespace-nowrap">
                    {p.qty} قطعة
                    <span className="block text-ink-muted">{money(p.revenue)}</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Section>
      </div>

      <Section title="مقاسات قربت تخلص">
        {s.lowStock.length === 0 ? (
          <p className="text-sm text-ink-muted">كل المقاسات فيها أكتر من قطعتين.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {s.lowStock.map((row) => (
              <li key={`${row.productId}:${row.size}`}>
                <Link
                  to={`/admin/products/${row.productId}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2 hover:border-line-strong"
                >
                  <span className="grid">
                    <span className="font-medium">{row.name.ar}</span>
                    <span className="spec text-ink-muted">
                      {row.color} · {row.size}
                    </span>
                  </span>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-sm font-semibold', row.qty === 0 ? 'bg-ember-tint text-danger' : 'bg-gold-tint text-gold-ink')}>
                    {row.qty === 0 ? 'خلص' : `${row.qty} باقي`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}
