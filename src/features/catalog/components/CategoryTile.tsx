import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { useLocalized } from '@/shared/hooks/useLocalized'
import type { Category } from '../types/catalog.types'
import { ProductBadge } from './ProductBadge'

/** Framed photo tile: hairline border, inset image, lift on hover. */
export function CategoryTile({ category, eager }: { category: Category; eager?: boolean }) {
  const { t } = useTranslation()
  const { l } = useLocalized()

  return (
    <Link
      to={`/collections/${category.slug}`}
      className="group grid gap-3 rounded-lg border border-line bg-surface p-2.5 pb-3 text-ink no-underline transition-[border-color,box-shadow,transform] duration-250 ease-brand hover:-translate-y-0.5 hover:border-line-strong hover:shadow-sm focus-visible:outline-offset-[3px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-surface-sunken">
        <img
          src={category.photo.src}
          alt={l(category.photo.alt)}
          loading={eager ? 'eager' : 'lazy'}
          className="size-full object-cover transition-transform duration-1000 ease-brand group-hover:scale-105"
          style={{ objectPosition: category.photo.focus }}
        />
        {category.badge && <ProductBadge kind={category.badge} className="absolute start-3 top-3" />}
        <span className="spec absolute end-3 bottom-3 rounded-full bg-white/90 px-2.5 py-[5px] backdrop-blur-md">
          {t('styles', { count: category.styles })}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 px-1">
        <b className="text-[17px] leading-snug font-semibold md:text-[19px]">{l(category.name)}</b>
        <span className="grid size-10 flex-none place-items-center rounded-full bg-surface-sunken transition-colors group-hover:bg-ember group-hover:text-ink">
          <BrandIcon name="arrow" directional className="size-5" />
        </span>
      </div>
    </Link>
  )
}
