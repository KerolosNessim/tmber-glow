import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Copy } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import { PageHeader, Section } from '../components/form'
import { StatusBadge } from '../components/StatusBadge'
import { ACTION_LABEL, NEXT_STATUSES, STATUS_LABEL, formatDate, money } from '../lib/orders'
import { adminService, errorMessage } from '../services/admin.service'
import type { Order, OrderStatus } from '../types'

export function OrderDetailsPage() {
  const { number = '' } = useParams()
  const queryClient = useQueryClient()
  const order = useQuery({ queryKey: ['admin', 'order', number], queryFn: () => adminService.order(number) })

  const [shipping, setShipping] = useState('')
  const [notes, setNotes] = useState('')
  useEffect(() => {
    if (order.data) {
      setShipping(order.data.shippingFee == null ? '' : String(order.data.shippingFee))
      setNotes(order.data.adminNotes)
    }
  }, [order.data])

  const update = useMutation({
    mutationFn: (patch: Parameters<typeof adminService.updateOrder>[1]) => adminService.updateOrder(number, patch),
    onSuccess: (data, patch) => {
      queryClient.setQueryData(['admin', 'order', number], data)
      void queryClient.invalidateQueries({ queryKey: ['admin'], predicate: (q) => q.queryKey[1] !== 'order' })
      toast.success(patch.status ? `الأوردر بقى «${STATUS_LABEL[patch.status]}»` : 'اتحفظ')
    },
    onError: (err) => toast.error(errorMessage(err)),
  })

  if (order.isPending) return <p className="text-ink-muted">جاري التحميل…</p>
  if (order.isError) return <p className="text-danger">{errorMessage(order.error)}</p>

  const o: Order = order.data
  const c = o.customer

  function changeStatus(status: OrderStatus) {
    if (status === 'cancelled' && !window.confirm('متأكد إنك عايز تلغي الأوردر؟ لو كان متأكد، القطع هترجع للمخزون.')) return
    update.mutate({ status })
  }

  function copyAddress() {
    const text = `${c.name}\n${c.phone}\n${c.governorate}، ${c.city}\n${c.address}`
    void navigator.clipboard.writeText(text).then(() => toast.success('العنوان اتنسخ'))
  }

  return (
    <div className="grid max-w-5xl gap-6">
      <PageHeader title={`أوردر #${o.number}`}>
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/orders">
            <ArrowRight className="icon-dir" />
            كل الأوردرات
          </Link>
        </Button>
      </PageHeader>

      <div className="-mt-3 flex flex-wrap items-center gap-3">
        <StatusBadge status={o.status} />
        <span className="text-sm text-ink-muted">{formatDate(o.createdAt)}</span>
        {o.stockDeducted && <span className="text-xs text-ink-muted">· القطع متخصومة من المخزون</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        {NEXT_STATUSES[o.status].map((s) => (
          <Button
            key={s}
            size="sm"
            variant={s === 'cancelled' ? 'outline' : s === 'new' ? 'ghost' : 'default'}
            disabled={update.isPending}
            onClick={() => changeStatus(s)}
            className={cn(s === 'cancelled' && 'text-danger')}
          >
            {ACTION_LABEL[s]}
          </Button>
        ))}
      </div>
      {o.status === 'new' && (
        <p className="-mt-3 text-sm text-ink-muted">لما تأكد الأوردر، القطع بتتخصم من المخزون. لو ألغيته بعد كده، بترجع تاني.</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Section title="المنتجات">
          <ul className="grid gap-3">
            {o.items.map((item) => (
              <li key={`${item.productId}:${item.size}`} className="grid grid-cols-[56px_1fr_auto] items-center gap-3">
                {item.photo ? (
                  <img src={item.photo} alt="" className="aspect-[4/5] w-14 rounded-md object-cover" />
                ) : (
                  <span className="aspect-[4/5] w-14 rounded-md bg-surface-sunken" />
                )}
                <div className="grid leading-snug">
                  <Link to={`/admin/products/${item.productId}`} className="font-medium hover:text-ember-ink">
                    {item.name.ar}
                  </Link>
                  <span className="spec text-ink-muted">
                    {item.color} · {item.size} · ×{item.qty}
                  </span>
                </div>
                <span className="text-end whitespace-nowrap">
                  {money(item.price * item.qty)}
                  {item.qty > 1 && <span className="block text-xs text-ink-muted">{money(item.price)} للقطعة</span>}
                </span>
              </li>
            ))}
          </ul>
          <dl className="grid gap-2 border-t border-dashed border-line-strong pt-4">
            <div className="flex justify-between">
              <dt className="text-ink-muted">المنتجات</dt>
              <dd>{money(o.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">الشحن</dt>
              <dd>{o.shippingFee == null ? 'لسه متحددش' : money(o.shippingFee)}</dd>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <dt>الإجمالي</dt>
              <dd>{money(o.total)}</dd>
            </div>
          </dl>
        </Section>

        <div className="grid content-start gap-6">
          <Section title="العميل">
            <dl className="grid gap-1.5 text-[15px]">
              <dt className="sr-only">الاسم</dt>
              <dd className="font-semibold">{c.name}</dd>
              <dt className="sr-only">الموبايل</dt>
              <dd className="spec text-sm">{c.phone}</dd>
              <dt className="sr-only">العنوان</dt>
              <dd>
                {c.governorate}، {c.city}
                <br />
                {c.address}
              </dd>
              {c.notes && (
                <>
                  <dt className="mt-2 text-sm text-ink-muted">ملاحظات العميل</dt>
                  <dd className="rounded-md bg-gold-tint px-3 py-2 text-sm">{c.notes}</dd>
                </>
              )}
            </dl>
            <div className="flex flex-wrap gap-2">
              {o.customerChatUrl && (
                <Button asChild size="sm" variant="secondary">
                  <a href={o.customerChatUrl} target="_blank" rel="noreferrer">
                    <BrandIcon name="whatsapp" className="size-4" strokeWidth={1.6} />
                    كلّمه واتساب
                  </a>
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={copyAddress}>
                <Copy className="size-4" />
                انسخ العنوان
              </Button>
            </div>
          </Section>

          <Section title="الشحن والملاحظات">
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                update.mutate({ shippingFee: shipping === '' ? null : Number(shipping), adminNotes: notes })
              }}
            >
              <label className="grid gap-1.5 text-sm">
                مصاريف الشحن (جنيه)
                <Input type="number" min={0} placeholder="اللي اتفقت عليه مع العميل" value={shipping} onChange={(e) => setShipping(e.target.value)} />
              </label>
              <label className="grid gap-1.5 text-sm">
                ملاحظات داخلية
                <Textarea rows={3} placeholder="مش بتظهر للعميل" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </label>
              <Button type="submit" size="sm" variant="secondary" disabled={update.isPending}>
                حفظ
              </Button>
            </form>
          </Section>

          <Section title="سجل الحالات">
            <ol className="grid gap-2 text-sm">
              {o.statusHistory.map((h, i) => (
                <li key={i} className="flex items-center justify-between gap-3">
                  <StatusBadge status={h.status} />
                  <span className="text-ink-muted">{formatDate(h.at)}</span>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </div>
    </div>
  )
}
