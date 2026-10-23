import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { NAV_ITEMS } from '../constants/navigation'

export function NavLinks() {
  const { t } = useTranslation('layout')
  return (
    <ul className="hidden gap-8 lg:flex">
      {NAV_ITEMS.map((item) => (
        <li key={item.key}>
          <NavLink
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                'relative block py-7 text-[15px] leading-none font-medium text-ink-muted no-underline transition-colors hover:text-ink',
                'after:absolute after:inset-x-[30%] after:bottom-[18px] after:h-[3px] after:scale-x-0 after:rounded-[3px] after:bg-ember after:transition-transform after:duration-250 hover:after:scale-x-100',
                isActive && item.to === '/' && 'text-ink after:scale-x-100',
              )
            }
          >
            {t(`nav.${item.key}`)}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
