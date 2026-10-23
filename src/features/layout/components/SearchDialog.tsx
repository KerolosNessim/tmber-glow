import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { Search, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { useProducts } from '@/features/catalog/hooks/useProducts'
import type { Product } from '@/features/catalog/types/catalog.types'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { normalizeSearch } from '@/shared/lib/search'
import { useUiStore } from '@/shared/store/ui.store'

const SUGGESTION_COUNT = 5

/** Header search: type to filter the catalogue, results show photo, name and price. */
export function SearchDialog() {
  const open = useUiStore((s) => s.isSearchOpen)
  const setOpen = useUiStore((s) => s.setSearchOpen)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/45 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed start-1/2 top-[8vh] z-[61] w-[min(640px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-white shadow-md outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2 rtl:translate-x-1/2"
        >
          <SearchPanel onNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function SearchPanel({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useTranslation('layout')
  const { l, price } = useLocalized()
  const products = useProducts()
  const [query, setQuery] = useState('')
  const listRef = useRef<HTMLUListElement>(null)

  const term = normalizeSearch(query)
  const results = useMemo<Product[]>(() => {
    const all = products.data ?? []
    if (!term) return all.slice(0, SUGGESTION_COUNT)
    const words = term.split(/\s+/)
    return all.filter((p) => {
      const haystack = normalizeSearch(`${p.name.ar} ${p.name.en} ${p.color} ${p.categorySlug.replace(/-/g, ' ')}`)
      return words.every((w) => haystack.includes(w))
    })
  }, [products.data, term])

  // Arrow keys move between the field and the results
  const moveFocus = (e: KeyboardEvent, from: 'input' | 'list') => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const links = Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])
    if (!links.length) return
    e.preventDefault()
    const index = links.findIndex((a) => a === document.activeElement)
    if (from === 'input') return void links[e.key === 'ArrowDown' ? 0 : links.length - 1].focus()
    const next = index + (e.key === 'ArrowDown' ? 1 : -1)
    if (next < 0) return void (e.currentTarget.closest('[role=dialog]')?.querySelector('input') as HTMLInputElement | null)?.focus()
    links[Math.min(next, links.length - 1)].focus()
  }

  return (
    <>
      <Dialog.Title className="sr-only">{t('search.title')}</Dialog.Title>
      <div className="flex items-center gap-3 border-b border-line px-5">
        <Search className="size-5 shrink-0 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => moveFocus(e, 'input')}
          placeholder={t('search.placeholder')}
          aria-label={t('search.title')}
          className="h-16 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink-muted [&::-webkit-search-cancel-button]:hidden"
        />
        <Dialog.Close
          aria-label={t('search.close')}
          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-surface-sunken"
        >
          <X className="size-5" strokeWidth={1.5} />
        </Dialog.Close>
      </div>

      <div className="no-scrollbar max-h-[min(60vh,520px)] overflow-y-auto p-2.5" aria-live="polite">
        {products.isLoading ? (
          <p className="px-3 py-10 text-center text-sm text-ink-muted">…</p>
        ) : results.length === 0 ? (
          <p className="px-3 py-10 text-center text-sm text-ink-muted">{t('search.empty', { query: query.trim() })}</p>
        ) : (
          <>
            <p className="spec px-3 pt-1.5 pb-2 text-ink-muted">
              {term ? t('search.count', { count: results.length }) : t('search.suggested')}
            </p>
            <ul ref={listRef} onKeyDown={(e) => moveFocus(e, 'list')} className="grid gap-1">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/products/${p.id}`}
                    onClick={onNavigate}
                    className="flex items-center gap-4 rounded-lg p-2 text-ink no-underline transition-colors hover:bg-surface-sunken focus-visible:bg-surface-sunken focus-visible:outline-offset-[-2px]"
                  >
                    <img
                      src={p.photo.src}
                      alt=""
                      loading="lazy"
                      className="h-[70px] w-14 shrink-0 rounded-md bg-surface-sunken object-cover"
                      style={{ objectPosition: p.photo.focus }}
                    />
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="truncate text-[15px] font-semibold">{l(p.name)}</span>
                      <span className="spec text-ink-muted">{p.color}</span>
                    </span>
                    <span className="grid shrink-0 justify-items-end tabular-nums">
                      <strong className="text-[15px]">{price(p.price)}</strong>
                      {p.compareAtPrice && <s className="text-xs text-ink-muted">{price(p.compareAtPrice)}</s>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
