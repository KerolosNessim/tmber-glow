import { useRef, type FormEvent, type ReactNode } from 'react'
import { toast } from 'sonner'
import { cn } from '@/shared/lib/utils'

export interface TabDef<Id extends string = string> {
  id: Id
  label: string
  /** Small number next to the label, e.g. how many slides */
  count?: number
}

/** Tabs that split a long form into short sections. */
export function TabBar<Id extends string>({ tabs, value, onChange }: { tabs: TabDef<Id>[]; value: Id; onChange: (id: Id) => void }) {
  return (
    <div role="tablist" className="no-scrollbar -mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-line px-1">
      {tabs.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              '-mb-px flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-3 py-2.5 text-[15px] whitespace-nowrap transition-colors',
              active ? 'border-forest font-semibold text-forest-deep' : 'border-transparent text-ink-muted hover:text-ink',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn('rounded-full px-1.5 text-xs', active ? 'bg-forest-tint' : 'bg-surface-sunken')}>{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/**
 * One tab's content. Hidden tabs stay mounted, so their values are kept and still validated.
 * `data-tab` lets `useInvalidTabSwitch` find which tab holds a missing field.
 */
export function TabPanel({ id, active, children }: { id: string; active: string; children: ReactNode }) {
  return (
    <div role="tabpanel" data-tab={id} hidden={id !== active} className="grid gap-6">
      {children}
    </div>
  )
}

/**
 * When the browser blocks a submit because of an empty required field inside a hidden tab,
 * open that tab and say so (the browser can't show its own message on a hidden field).
 * Put the returned handler on the <form> as onInvalidCapture.
 */
export function useInvalidTabSwitch<Id extends string>(tabs: TabDef<Id>[], setActive: (id: Id) => void) {
  const handled = useRef(false)

  return (e: FormEvent) => {
    // One invalid event fires per bad field; react to the first one only.
    if (handled.current) return
    const panel = (e.target as HTMLElement).closest<HTMLElement>('[data-tab]')
    if (!panel?.hidden) return
    handled.current = true
    queueMicrotask(() => (handled.current = false))
    const tab = tabs.find((t) => t.id === panel.dataset.tab)
    if (!tab) return
    setActive(tab.id)
    toast.error(`في بيانات ناقصة في «${tab.label}»`)
  }
}
