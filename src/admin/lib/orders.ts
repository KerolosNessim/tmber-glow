import type { OrderStatus } from '../types'

export const ORDER_STATUSES: OrderStatus[] = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled']

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'جديد',
  confirmed: 'متأكد',
  shipped: 'اتشحن',
  delivered: 'اتسلّم',
  cancelled: 'ملغي',
}

export const STATUS_CLASS: Record<OrderStatus, string> = {
  new: 'bg-ember-tint text-ember-ink',
  confirmed: 'bg-gold-tint text-gold-ink',
  shipped: 'bg-forest-tint text-forest',
  delivered: 'bg-forest text-on-forest',
  cancelled: 'bg-surface-sunken text-ink-muted line-through',
}

/** What the admin can do next from each status (the API accepts any change; this keeps the UI simple). */
export const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  new: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled', 'new'],
  shipped: ['delivered', 'cancelled'],
  delivered: ['shipped'],
  cancelled: ['new'],
}

export const ACTION_LABEL: Record<OrderStatus, string> = {
  new: 'رجّعه جديد',
  confirmed: 'أكّد الأوردر',
  shipped: 'اتشحن',
  delivered: 'اتسلّم',
  cancelled: 'إلغاء الأوردر',
}

const dateFormat = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  timeZone: 'Africa/Cairo',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

export const formatDate = (iso: string) => dateFormat.format(new Date(iso))

export const money = (n: number) => `${n.toLocaleString('en-US')} جنيه`
