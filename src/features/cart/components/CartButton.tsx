import { useEffect, useRef, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import { useUiStore } from '@/shared/store/ui.store'
import { cn } from '@/shared/lib/utils'
import { useCartSummary } from '../hooks/useCartSummary'

export function CartButton() {
  const { t } = useTranslation('layout')
  const openCart = useUiStore((s) => s.openCart)
  const { count } = useCartSummary()
  const [bump, setBump] = useState(false)
  const previous = useRef(count)

  // Bump the counter when something is added
  useEffect(() => {
    if (count > previous.current) setBump(true)
    previous.current = count
  }, [count])

  return (
    <Button variant="ghost" size="icon" className="relative" aria-label={`${t('aria.bag')} (${count})`} onClick={openCart}>
      <ShoppingBag strokeWidth={1.5} />
      <span
        onAnimationEnd={() => setBump(false)}
        className={cn(
          'absolute end-[3px] top-[5px] grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ember px-1 text-[11px] leading-none font-bold text-ink tabular-nums',
          bump && 'animate-bump',
        )}
      >
        {count}
      </span>
    </Button>
  )
}
