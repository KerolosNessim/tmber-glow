import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ChevronDown, ChevronUp, ImageIcon, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { ConfirmDelete } from './ConfirmDelete'

/**
 * Repeating items (slides, perks, posts…) with add, remove and reorder.
 * Each item is a collapsed row (thumbnail + title); only the one being edited is open.
 */
export function ListEditor<T>({
  items,
  onChange,
  create,
  renderItem,
  itemTitle,
  thumbnail,
  addLabel,
  min = 0,
  max = Infinity,
}: {
  items: T[]
  onChange: (items: T[]) => void
  create: () => T
  renderItem: (item: T, update: (item: T) => void, index: number) => ReactNode
  itemTitle: (item: T, index: number) => string
  /** Photo shown in the collapsed row */
  thumbnail?: (item: T) => string | undefined
  addLabel: string
  min?: number
  max?: number
}) {
  const [open, setOpen] = useState<number | null>(null)
  const warned = useRef(false)

  const update = (index: number) => (item: T) => onChange(items.map((x, i) => (i === index ? item : x)))

  function move(index: number, by: -1 | 1) {
    const next = [...items]
    const [item] = next.splice(index, 1)
    next.splice(index + by, 0, item)
    onChange(next)
    // Keep the same item open after it moves.
    if (open === index) setOpen(index + by)
    else if (open === index + by) setOpen(index)
  }

  function remove(index: number) {
    onChange(items.filter((_, j) => j !== index))
    if (open === index) setOpen(null)
    else if (open !== null && open > index) setOpen(open - 1)
  }

  function add() {
    onChange([...items, create()])
    setOpen(items.length)
  }

  /** A required field inside a closed item: open it, since the browser can't point at a hidden field. */
  function onInvalidCapture(e: FormEvent) {
    const body = (e.target as HTMLElement).closest<HTMLElement>('[data-list-item]')
    if (!body?.hidden || warned.current) return
    warned.current = true
    queueMicrotask(() => (warned.current = false))
    const index = Number(body.dataset.listItem)
    setOpen(index)
    // The tab switcher already says something when the whole tab is hidden.
    if (!body.closest<HTMLElement>('[data-tab]')?.hidden) toast.error(`في بيانات ناقصة في «${itemTitle(items[index], index)}»`)
  }

  return (
    <div className="grid gap-2" onInvalidCapture={onInvalidCapture}>
      {items.map((item, i) => {
        const isOpen = open === i
        const thumb = thumbnail?.(item)
        return (
          <div key={i} className={cn('rounded-md border bg-surface', isOpen ? 'border-line-strong shadow-sm' : 'border-line')}>
            <div className="flex items-center gap-2 p-2 ps-3">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-start"
              >
                {thumbnail &&
                  (thumb ? (
                    <img src={thumb} alt="" className="size-10 shrink-0 rounded object-cover" />
                  ) : (
                    <span className="grid size-10 shrink-0 place-items-center rounded bg-surface-sunken text-ink-muted">
                      <ImageIcon className="size-4" />
                    </span>
                  ))}
                <span className="truncate font-medium">{itemTitle(item, i)}</span>
                <ChevronDown className={cn('ms-auto size-4 shrink-0 text-ink-muted transition-transform', isOpen && 'rotate-180')} />
              </button>
              <div className="flex shrink-0 gap-0.5 border-s border-line ps-1">
                <IconButton label="لفوق" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ChevronUp className="size-4" />
                </IconButton>
                <IconButton label="لتحت" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                  <ChevronDown className="size-4" />
                </IconButton>
                {items.length <= min ? (
                  <IconButton label="امسح" disabled>
                    <Trash2 className="size-4" />
                  </IconButton>
                ) : (
                  <ConfirmDelete
                    title={`مسح «${itemTitle(item, i)}»؟`}
                    description="هيتشال من الصفحة الرئيسية لما تدوس حفظ."
                    confirmLabel="امسح"
                    onConfirm={() => remove(i)}
                  >
                    <IconButton label="امسح" className="hover:bg-ember-tint hover:text-danger">
                      <Trash2 className="size-4" />
                    </IconButton>
                  </ConfirmDelete>
                )}
              </div>
            </div>
            <div data-list-item={i} hidden={!isOpen} className="grid gap-4 border-t border-line p-4">
              {renderItem(item, update(i), i)}
            </div>
          </div>
        )
      })}
      {items.length < max && (
        <Button type="button" variant="outline" size="sm" className="mt-2 justify-self-start" onClick={add}>
          <Plus className="size-4" />
          {addLabel}
        </Button>
      )}
    </div>
  )
}

function IconButton({
  label,
  children,
  className = '',
  ...props
}: { label: string; children: ReactNode } & React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid size-8 cursor-pointer place-items-center rounded-md hover:bg-surface-sunken disabled:cursor-default disabled:opacity-30 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const newId = () => Math.random().toString(36).slice(2, 10)
