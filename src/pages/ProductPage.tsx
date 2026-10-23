import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '@/features/cart/store/cart.store'
import { ProductBadge } from '@/features/catalog/components/ProductBadge'
import { ProductBuyBox } from '@/features/catalog/components/ProductBuyBox'
import { ProductGrid } from '@/features/catalog/components/ProductGrid'
import { SizeChart } from '@/features/catalog/components/SizeChart'
import { DEFAULT_SIZE } from '@/features/catalog/constants/catalog.constants'
import { useCategory } from '@/features/catalog/hooks/useCategories'
import { useProduct } from '@/features/catalog/hooks/useProduct'
import { useProducts } from '@/features/catalog/hooks/useProducts'
import type { Product, Size } from '@/features/catalog/types/catalog.types'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { Skeleton } from '@/shared/components/Skeleton'
import { Button } from '@/shared/components/ui/button'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { useUiStore } from '@/shared/store/ui.store'

const RELATED_COUNT = 4

/** /products/:id — photo, colour and size pickers, size chart and related products. */
export default function ProductPage() {
  const { id } = useParams()
  const product = useProduct(id)
  const catalog = useProducts()
  const category = useCategory(product.data?.categorySlug)

  if (product.error) return <ProductNotFound />
  if (product.isLoading || !product.data) return <ProductSkeleton />

  // Keyed by id so size, quantity and the size-chart helper reset when the colour changes
  return <ProductView key={product.data.id} product={product.data} catalog={catalog.data} catalogLoading={catalog.isLoading} group={category.data?.group ?? 'tops'} />
}

interface ViewProps {
  product: Product
  catalog: Product[] | undefined
  catalogLoading: boolean
  group: 'tops' | 'bottoms'
}

function ProductView({ product, catalog, catalogLoading, group }: ViewProps) {
  const { t } = useTranslation(['catalog', 'common'])
  const { l, price } = useLocalized()
  const add = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)
  const [size, setSize] = useState<Size>(product.sizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : product.sizes[0])

  const family = product.family ?? product.id
  const colors = (catalog ?? [product]).filter((p) => (p.family ?? p.id) === family)

  // Same category first, then the rest of the range; never the same style in another colour
  const others = (catalog ?? []).filter((p) => (p.family ?? p.id) !== family)
  const related = [...others.filter((p) => p.categorySlug === product.categorySlug), ...others.filter((p) => p.categorySlug !== product.categorySlug)].slice(0, RELATED_COUNT)

  return (
    <div className="wrap pt-6 pb-28 md:pt-10 lg:pb-0">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Link to="/" className="no-underline hover:text-ink">{t('product.breadcrumbHome')}</Link>
        <span aria-hidden="true">/</span>
        <Link to="/collections" className="no-underline hover:text-ink">{t('allTitle')}</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink" aria-current="page">{l(product.name)}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-sunken lg:sticky lg:top-28">
          <img
            src={product.photo.src}
            alt={l(product.photo.alt)}
            fetchPriority="high"
            className="size-full object-cover"
            style={{ objectPosition: product.photo.focus }}
          />
          {product.badge && <ProductBadge kind={product.badge} className="absolute end-4 top-4" />}
          {/* Hang-tag: colour and fabric weight, as on the garment */}
          <span className="spec absolute start-4 top-4 inline-flex items-center gap-2 rounded-md bg-gold py-1.5 ps-2.5 pe-3 text-forest-deep shadow-sm">
            <i className="size-1.5 shrink-0 rounded-full bg-forest-deep/70" aria-hidden="true" />
            {product.color} · {product.gsm} GSM
          </span>
        </div>

        <ProductBuyBox product={product} colors={colors} size={size} onSizeChange={setSize} />
      </div>

      <section id="size-guide" aria-labelledby="size-guide-title" className="scroll-mt-28 pt-section">
        <SectionHeader
          id="size-guide-title"
          title={t(group === 'tops' ? 'chart.titleTops' : 'chart.titleBottoms')}
          subtitle={t('chart.subtitle')}
        />
        <SizeChart group={group} selected={size} />
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="py-section">
          <SectionHeader id="related-title" title={t('product.related.title')} subtitle={t('product.related.subtitle')} />
          <ProductGrid products={related} isLoading={catalogLoading} />
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-line bg-white/95 px-(--gutter) py-3 backdrop-blur-md lg:hidden">
        <div className="grid leading-tight">
          <strong className="text-lg tabular-nums">{price(product.price)}</strong>
          <span className="spec text-ink-muted">{size}</span>
        </div>
        <Button
          className="flex-1"
          onClick={() => {
            add(product, size)
            openCart()
          }}
        >
          {t('common:actions.addToBag')}
        </Button>
      </div>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="wrap grid gap-8 pt-10 pb-section lg:grid-cols-[1.1fr_1fr] lg:gap-16" aria-busy="true">
      <Skeleton className="aspect-[4/5]" />
      <div className="grid content-start gap-5">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-14" />
      </div>
    </div>
  )
}

function ProductNotFound() {
  const { t } = useTranslation(['catalog', 'common'])
  return (
    <div className="wrap grid justify-items-center gap-5 py-section text-center">
      <h1 className="text-3xl font-semibold">{t('product.notFound')}</h1>
      <Button asChild>
        <Link to="/collections">{t('common:actions.shopAll')}</Link>
      </Button>
    </div>
  )
}
