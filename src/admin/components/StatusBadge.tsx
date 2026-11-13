import { cn } from '@/shared/lib/utils'
import { STATUS_CLASS, STATUS_LABEL } from '../lib/orders'
import type { OrderStatus } from '../types'

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap', STATUS_CLASS[status])}>{STATUS_LABEL[status]}</span>
}
