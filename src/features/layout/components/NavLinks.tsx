import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { NAV_ITEMS, isNavActive } from '../constants/navigation'

export function NavLinks() {
  const { t } = useTranslation('layout')
  const { pathname } = useLocation()
  return (
    <ul className="hidden gap-8 lg:flex">
      {NAV_ITEMS.map((item) => {
        const active = isNavActive(item.to, pathname)
        return (
          <li key={item.key}>
            <Link
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative block py-7 text-[15px] leading-none font-medium text-ink-muted no-underline transition-colors hover:text-ink',
                'after:absolute after:inset-x-[30%] after:bottom-[18px] after:h-[3px] after:scale-x-0 after:rounded-[3px] after:bg-ember after:transition-transform after:duration-250 hover:after:scale-x-100',
                active && 'font-semibold text-ember-ink after:scale-x-100 hover:text-ember-ink',
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
