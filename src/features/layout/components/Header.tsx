import { CartButton } from '@/features/cart/components/CartButton'
import CardNav, { type CardNavItem } from '@/shared/components/CardNav'
import { Logo } from '@/shared/components/Logo'
import { Button } from '@/shared/components/ui/button'
import { useUiStore } from '@/shared/store/ui.store'
import { Search } from 'lucide-react'
import type { AnchorHTMLAttributes, CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { Link, useLocation } from 'react-router'
import { NAV_ITEMS, isNavActive } from '../constants/navigation'
import { LanguageSwitch } from './LanguageSwitch'
import { NavLinks } from './NavLinks'
import { SearchDialog } from './SearchDialog'

/** CardNav renders plain `href` anchors; route them through the router instead. */
function RouterAnchor({ href = '#', className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { pathname } = useLocation()
  const isNavLink = NAV_ITEMS.some((item) => item.to === href)
  const active = isNavLink && isNavActive(href, pathname)
  return (
    <Link
      to={href}
      aria-current={active ? 'page' : undefined}
      className={cn(className, active && 'font-semibold text-ember-ink!')}
      {...props}
    />
  )
}

const SHOP_KEYS = ['home', 'catalog', 'sets']

/** Floating header: frosted pill with inline nav on desktop, CardNav card menu on small screens. */
export function Header() {
  const { t } = useTranslation('layout')
  const isMenuOpen = useUiStore((s) => s.isMenuOpen)
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)
  const setSearchOpen = useUiStore((s) => s.setSearchOpen)

  const toGroup = (label: string, keep: (key: string) => boolean): CardNavItem => ({
    label,
    links: NAV_ITEMS.filter((item) => keep(item.key)).map((item) => ({
      label: t(`nav.${item.key}`),
      href: item.to,
    })),
  })
  const cards = [
    toGroup(t('footer.shop'), (key) => SHOP_KEYS.includes(key)),
    toGroup(t('footer.help'), (key) => !SHOP_KEYS.includes(key)),
  ]

  return (
    <header className="wrap sticky top-0 z-50 pt-3">
      {/* Small screens */}
      <div className="lg:hidden">
        <CardNav
          logo="/images/tg-mark.png"
          logoHref="/"
          logoAlt="Timber Glow"
          items={cards}
          theme="light"
          surface="glass"
          maxWidth={720}
          cardHeight={150}
          intro={false}
          style={{ '--cn-logo': '28px' } as CSSProperties}
          menuLabel={false}
          menuText={t('aria.menu')}
          closeText={t('aria.close')}
          ariaLabel={t('aria.menu')}
          linkComponent={RouterAnchor}
          open={isMenuOpen}
          onOpenChange={setMenuOpen}
          actions={
            <>
              <Button variant="ghost" size="icon" aria-label={t('aria.search')} onClick={() => setSearchOpen(true)}>
                <Search strokeWidth={1.5} />
              </Button>
              <CartButton />
              <LanguageSwitch />
            </>
          }
        />
      </div>

      {/* Large screens */}
      <div className="hidden min-h-[68px] grid-cols-[1fr_auto_1fr] items-center gap-6 rounded-xl border border-line bg-white/85 px-8 shadow-[0_10px_30px_-12px_rgba(23,32,27,0.25)] backdrop-blur-[14px] backdrop-saturate-[1.4] lg:grid">
        <Logo className="justify-self-start" />
        <NavLinks />
        <div className="flex items-center justify-end gap-0.5">
          <Button variant="ghost" size="icon" aria-label={t('aria.search')} onClick={() => setSearchOpen(true)}>
            <Search strokeWidth={1.5} />
          </Button>

          <CartButton />
          <LanguageSwitch />
        </div>
      </div>
      <SearchDialog />
    </header>
  )
}
