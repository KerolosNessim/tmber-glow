import { useState } from 'react'
import { Link } from 'react-router'
import { Minus, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MAX_QTY_PER_LINE } from '@/features/cart/constants/cart.constants'
import { useCartStore } from '@/features/cart/store/cart.store'
import { Button } from '@/shared/components/ui/button'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { cn } from '@/shared/lib/utils'
import { useUiStore } from '@/shared/store/ui.store'
import { isSizeAvailable } from '../lib/availability'
import type { Product, Size } from '../types/catalog.types'

const DETAILS = ['fabric', 'fit', 'care'] as const

interface Props {
  product: Product
  /** The same style in other colours, including this one */
  colors: Product[]
  size: Size
  onSizeChange: (size: Size) => void
}

/** Title, price, colour and size pickers, quantity, add to bag, perks and fabric details. */
export function ProductBuyBox({ product, colors, size, onSizeChange }: Props) {
  const { t } = useTranslation(['catalog', 'common'])
  const { l, price } = useLocalized()
  const add = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)
  const [qty, setQty] = useState(1)
  const canBuy = isSizeAvailable(product, size)

  const addToBag = () => {
    add(product, size, qty)
    openCart()
  }

  return (
    <div className="grid gap-7">
      <header className="grid gap-3">
        <h1 className="text-[clamp(30px,3.4vw,48px)] leading-[1.2] font-semibold ltr:leading-[1.08] ltr:tracking-[-0.02em]">{l(product.name)}</h1>
        <p className="flex flex-wrap items-baseline gap-3 tabular-nums">
          <strong className="text-[28px] leading-none font-bold">{price(product.price)}</strong>
          {product.compareAtPrice && <s className="text-base text-ink-muted">{price(product.compareAtPrice)}</s>}
        </p>
      </header>

      <div className="grid gap-7 border-t border-dashed border-line-strong pt-7">
        <fieldset className="grid gap-3">
          <legend className="mb-3 flex w-full items-baseline justify-between gap-3 text-[15px] font-semibold">
            <span>
              {t('product.size')} <span className="spec ms-2 text-ink-muted">{size}</span>
            </span>
            <a href="#size-guide" className="text-sm font-medium text-ink underline underline-offset-4 hover:text-ember-ink">
              {t('product.sizeGuide')}
            </a>
          </legend>
          <div className="flex flex-wrap gap-2" >
            {product.sizes.map((s) => {
              const available = isSizeAvailable(product, s)
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={s === size}
                  disabled={!available}
                  title={available ? undefined : t('soldOut')}
                  onClick={() => onSizeChange(s)}
                  className={cn(
                    'size-12 flex items-center justify-center cursor-pointer rounded-full border-[1.5px] px-4 text-[15px] font-semibold transition-colors',
                    s === size ? 'border-forest bg-forest text-surface' : 'border-line-strong hover:border-ink',
                    !available && 'cursor-not-allowed border-line text-ink-muted line-through opacity-50 hover:border-line',
                  )}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </fieldset>
        {colors.length > 1 && (
          <fieldset className="grid gap-3">
            <legend className="mb-3 flex items-baseline gap-3 text-[15px] font-semibold">
              {t('product.color')} <span className="spec text-ink-muted">{product.color}</span>
            </legend>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => {
                const current = c.id === product.id
                return (
                  <Link
                    key={c.id}
                    to={`/products/${c.id}`}
                    replace
                    aria-label={c.color}
                    aria-current={current ? 'page' : undefined}
                    title={c.color}
                    className={cn(
                      'grid size-11 place-items-center rounded-full border-[1.5px] transition-colors',
                      current ? 'border-ink' : 'border-transparent hover:border-line-strong',
                    )}
                  >
                    <span className="size-8 rounded-full shadow-[inset_0_0_0_1px_rgb(23_32_27/0.14)]" style={{ background: c.swatch }} />
                  </Link>
                )
              })}
            </div>
          </fieldset>
        )}


        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex h-14 items-center rounded-full border-[1.5px] border-line-strong px-1" role="group" aria-label={t('product.quantity')}>
            <button
              type="button"
              aria-label={t('product.decrease')}
              disabled={qty <= 1}
              onClick={() => setQty((q) => q - 1)}
              className="grid size-12 cursor-pointer place-items-center rounded-full transition-colors bg-ember text-white hover:bg-ember-ink disabled:cursor-default disabled:opacity-35"
            >
              <Minus className="size-4" />
            </button>
            <output className="min-w-8 text-center font-semibold tabular-nums" aria-live="polite">{qty}</output>
            <button
              type="button"
              aria-label={t('product.increase')}
              disabled={qty >= MAX_QTY_PER_LINE}
              onClick={() => setQty((q) => q + 1)}
              className="grid size-12 cursor-pointer place-items-center rounded-full transition-colors bg-ember text-white hover:bg-ember-ink disabled:cursor-default disabled:opacity-35"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <Button size="lg" className="min-w-[200px] flex-1" disabled={!canBuy} onClick={addToBag}>
            {canBuy ? (
              <>
                {t('common:actions.addToBag')} · <span className="tabular-nums">{price(product.price * qty)}</span>
              </>
            ) : (
              t('soldOut')
            )}
          </Button>
        </div>
      </div>

      <div className="border-t border-dashed border-line-strong">
        {DETAILS.map((key) => (
          <details key={key} className="group border-b border-dashed border-line-strong py-4" open={key === 'fabric'}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
              {t(`product.details.${key}`)}
              <Plus className="size-4 transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
            </summary>
            <p className="mt-3 max-w-[56ch] text-[15px] text-ink-muted">{t(`product.details.${key}Body`, { gsm: product.gsm })}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
