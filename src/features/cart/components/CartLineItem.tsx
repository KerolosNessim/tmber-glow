import { Minus, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { useCartStore } from '../store/cart.store'
import type { CartLine } from '../types/cart.types'

export function CartLineItem({ line }: { line: CartLine }) {
  const { t } = useTranslation('cart')
  const { l, price } = useLocalized()
  const setQty = useCartStore((s) => s.setQty)
  const remove = useCartStore((s) => s.remove)

  return (
    <li className="grid grid-cols-[76px_1fr_auto] gap-4 border-b border-line py-4">
      <img
        src={line.product.photo.src}
        alt=""
        className="aspect-[4/5] w-[76px] rounded-sm bg-surface-sunken object-cover"
        style={{ objectPosition: line.product.photo.focus }}
      />
      <div className="grid min-w-0 content-start gap-0.5">
        <b className="text-[15px] leading-snug font-semibold">{l(line.product.name)}</b>
        <span className="spec text-ink-muted justify-self-start">
          {line.product.color} · {line.size}
        </span>
        <div className="mt-2 inline-flex items-center justify-self-start rounded-full border-[1.5px] border-line-strong">
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center"
            aria-label={t('decrease')}
            onClick={() => setQty(line.key, line.qty - 1)}
          >
            <Minus className="size-3.5" />
          </button>
          <span className="min-w-6 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center"
            aria-label={t('increase')}
            onClick={() => setQty(line.key, line.qty + 1)}
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="grid content-between justify-items-end">
        <span className="text-[15px] font-bold whitespace-nowrap tabular-nums">{price(line.product.price * line.qty)}</span>
        <button
          type="button"
          className="cursor-pointer text-[13px] text-ink-muted underline underline-offset-[3px]"
          onClick={() => remove(line.key)}
        >
          {t('remove')}
        </button>
      </div>
    </li>
  )
}
