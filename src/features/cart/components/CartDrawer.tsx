import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { Button } from '@/shared/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '@/shared/components/ui/sheet'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { useUiStore } from '@/shared/store/ui.store'
import { useCartSummary } from '../hooks/useCartSummary'
import { useCartStore } from '../store/cart.store'
import { CartLineItem } from './CartLineItem'
import { FreeShippingBar } from './FreeShippingBar'

/** Slides in from the inline end: the left in Arabic, the right in English. */
export function CartDrawer() {
  const { t } = useTranslation('cart')
  const { price, isRtl, dir } = useLocalized()
  const isOpen = useUiStore((s) => s.isCartOpen)
  const setOpen = useUiStore((s) => s.setCartOpen)
  const lines = useCartStore((s) => s.lines)
  const { count, subtotal } = useCartSummary()

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side={isRtl ? 'left' : 'right'}
        dir={dir}
        showCloseButton={false}
        className="grid w-full grid-rows-[auto_auto_1fr_auto] gap-0 overflow-hidden border-0 p-0 shadow-md sm:max-w-[440px] rounded-s-lg"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <SheetTitle className="text-xl leading-snug font-semibold">
            {t('title')} ({count})
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label={t('closeBag')}>
              <X strokeWidth={1.5} />
            </Button>
          </SheetClose>
        </div>
        <FreeShippingBar />
        <ul className="overflow-y-auto px-6">
          {lines.length === 0 ? (
            <li className="px-6 py-12 text-center text-ink-muted">{t('empty')}</li>
          ) : (
            lines.map((line) => <CartLineItem key={line.key} line={line} />)
          )}
        </ul>
        <div className="grid gap-3 border-t border-line px-6 pt-4 pb-6">
          <div className="flex items-baseline justify-between text-lg font-bold">
            <span>{t('subtotal')}</span>
            <strong className="text-[22px] leading-none tabular-nums">{price(subtotal)}</strong>
          </div>
          <SheetDescription className="text-[13px] text-ink-muted">{t('note')}</SheetDescription>
          <Button className="w-full" disabled={lines.length === 0}>
            {t('checkout')} <BrandIcon name="arrow" directional />
          </Button>
          <SheetClose asChild>
            <button type="button" className="cursor-pointer text-sm text-ink underline underline-offset-4">
              {t('continue')}
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
