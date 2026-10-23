import { Link, useParams, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CATEGORY_GROUPS } from '@/features/catalog/constants/catalog.constants'
import { ProductGrid } from '@/features/catalog/components/ProductGrid'
import { useCategories, useCategory } from '@/features/catalog/hooks/useCategories'
import { useProducts } from '@/features/catalog/hooks/useProducts'
import type { CategoryGroup } from '@/features/catalog/types/catalog.types'
import { ErrorMessage } from '@/shared/components/StatusMessage'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { cn } from '@/shared/lib/utils'

const chip = 'inline-flex h-10 items-center rounded-full border-[1.5px] px-4 text-sm font-semibold no-underline transition-colors'

/** /collections (all, filterable by group) and /collections/:slug (one category) */
export default function CollectionPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const group = (CATEGORY_GROUPS as string[]).includes(params.get('group') ?? '') ? (params.get('group') as CategoryGroup) : undefined
  const { t } = useTranslation('catalog')
  const { l } = useLocalized()

  const category = useCategory(slug)
  const groupCategories = useCategories(group)
  const products = useProducts({ category: slug })

  if (category.error) return <ErrorMessage />

  const visible = slug || !group
    ? products.data
    : products.data?.filter((p) => groupCategories.data?.some((c) => c.slug === p.categorySlug))

  const title = category.data ? l(category.data.name) : t('allTitle')
  const subtitle = category.data ? l(category.data.description) : t('allSubtitle')

  return (
    <div className="wrap pt-10 pb-section md:pt-16">
      <header className="mb-8 grid gap-3">
        <h1 className="text-[clamp(32px,4vw,56px)] leading-[1.2] font-semibold ltr:tracking-[-0.02em]">{title}</h1>
        <p className="max-w-[54ch] text-ink-muted">{subtitle}</p>
        {visible && <p className="spec justify-self-start text-gold-ink">{t('count', { count: visible.length })}</p>}
      </header>

      {!slug && (
        <nav className="mb-8 flex flex-wrap gap-2">
          {[undefined, ...CATEGORY_GROUPS].map((g) => (
            <Link
              key={g ?? 'all'}
              to={g ? `/collections?group=${g}` : '/collections'}
              className={cn(chip, g === group ? 'border-forest bg-forest text-surface' : 'border-line-strong hover:border-forest hover:bg-forest/10 hover:text-forest')}
            >
              {t(`groups.${g ?? 'all'}`)}
            </Link>
          ))}
        </nav>
      )}

      <ProductGrid products={visible} isLoading={products.isLoading || (!!group && groupCategories.isLoading)} />
    </div>
  )
}
