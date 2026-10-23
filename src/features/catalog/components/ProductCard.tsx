import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAddToCart } from '@/features/cart/hooks/useAddToCart'
import { Button } from '@/shared/components/ui/button'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { cn } from '@/shared/lib/utils'
import { DEFAULT_SIZE } from '../constants/catalog.constants'
import type { Product, Size } from '../types/catalog.types'
import { ProductBadge } from './ProductBadge'

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation(['catalog', 'common'])
  const { l, price } = useLocalized()
  const addToCart = useAddToCart()
  const [size, setSize] = useState<Size>(product.sizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : product.sizes[0])

  return (
    <article className="grid content-start gap-3 rounded-lg border border-line bg-surface p-2.5 pb-4 transition-[border-color,box-shadow] duration-250 hover:border-line-strong hover:shadow-sm">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-surface-sunken">
        <Link to={`/products/${product.id}`} aria-label={l(product.name)} className="absolute inset-0 z-[1]" />
        <img
          src={product.photo.src}
          alt={l(product.photo.alt)}
          loading="lazy"
          className="size-full object-cover"
          style={{ objectPosition: product.photo.focus }}
        />
        {product.badge && <ProductBadge kind={product.badge} className="absolute start-3 top-3" />}
        <span className="spec absolute end-3 bottom-3 rounded-full bg-white/90 px-2.5 py-[5px] backdrop-blur-md">
          {product.color} · {product.gsm} GSM
        </span>
      </div>
      <div className="grid gap-1 px-1">
        <h3 className="text-[17px] leading-snug font-semibold">
          <Link to={`/products/${product.id}`} className="text-ink no-underline hover:text-ember-ink">
            {l(product.name)}
          </Link>
        </h3>
        <p className="flex items-baseline gap-2 tabular-nums">
          <strong className="font-bold">{price(product.price)}</strong>
          {product.compareAtPrice && <s className="text-sm text-ink-muted">{price(product.compareAtPrice)}</s>}
        </p>
      </div>
      <fieldset className="px-1">
        <legend className="sr-only">{t('chooseSize')}</legend>
        <div className="flex flex-wrap gap-1.5" >
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={s === size}
              onClick={() => setSize(s)}
              className={cn(
                'size-9 flex items-center justify-center cursor-pointer rounded-full border-[1.5px] px-2 text-[13px] font-semibold transition-colors',
                s === size ? 'border-forest bg-forest text-surface' : 'border-line-strong hover:border-forest hover:bg-forest/10 hover:text-forest',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>
      <Button size="sm" className="mx-1" onClick={() => addToCart(product, size)}>
        {t('common:actions.addToBag')}
      </Button>
    </article>
  )
}
