import { useTranslation } from 'react-i18next'
import type { Product } from '@/features/catalog/types/catalog.types'
import { useAddToCart } from '@/features/cart/hooks/useAddToCart'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { Button } from '@/shared/components/ui/button'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { cn } from '@/shared/lib/utils'
import type { Hotspot } from '../types/home.types'

interface LookHotspotProps {
  hotspot: Hotspot
  product: Product
  open: boolean
  onToggle: () => void
}

/** "Shop the look" pin on the feature photo. */
export function LookHotspot({ hotspot, product, open, onToggle }: LookHotspotProps) {
  const { t } = useTranslation(['home', 'common'])
  const { l, price } = useLocalized()
  const addToCart = useAddToCart()

  return (
    <div
      className="absolute z-[3] -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label={t('look.hotspot', { name: l(product.name) })}
        onClick={onToggle}
        className="relative grid size-[34px] cursor-pointer place-items-center rounded-full bg-surface text-ink before:absolute before:-inset-2 before:animate-ping-soft before:rounded-full before:border-[1.5px] before:border-white/80 hover:bg-on-forest"
      >
        <BrandIcon name="plus" strokeWidth={2} className={cn('size-3.5 transition-transform', open && 'rotate-45')} />
      </button>
      <div
        className={cn(
          'absolute top-[calc(100%+12px)] left-1/2 z-10 grid w-[210px] -translate-x-1/2 grid-cols-[64px_1fr] items-center gap-3 rounded-md bg-surface p-3 text-ink shadow-md transition-opacity duration-200',
          'md:top-1/2 md:w-[280px] md:translate-x-0 md:-translate-y-1/2',
          // small screens: open upwards from low pins, and keep the card inside the photo's sides
          hotspot.y > 55 && 'max-md:top-auto max-md:bottom-[calc(100%+12px)]',
          hotspot.x > 66 && 'max-md:right-0 max-md:left-auto max-md:translate-x-0',
          hotspot.x < 34 && 'max-md:left-0 max-md:translate-x-0',
          // large screens: open the card towards the middle of the photo
          hotspot.x > 50 ? 'md:right-[calc(100%+14px)] md:left-auto' : 'md:left-[calc(100%+14px)]',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <img
          src={product.photo.src}
          alt=""
          className="aspect-[4/5] w-16 rounded-sm bg-surface-sunken object-cover"
          style={{ objectPosition: product.photo.focus }}
        />
        <div>
          <b className="block text-sm leading-snug font-bold">{l(product.name)}</b>
          <span className="spec">
            {product.color} · L
          </span>
          <div className="text-[15px] font-bold tabular-nums">{price(product.price)}</div>
        </div>
        <Button size="sm" className="col-span-2" onClick={() => addToCart(product)}>
          {t('common:actions.addToBag')}
        </Button>
      </div>
    </div>
  )
}
