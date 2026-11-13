import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { FOOTER_HELP, FOOTER_SHOP } from '../constants/navigation'
import { useSocialLinks } from '../hooks/useStoreSettings'
import type { FooterLink } from '../types/layout.types'

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  const { t } = useTranslation('layout')
  return (
    <div>
      <h3 className="mb-4 text-[13px] leading-tight font-semibold text-gold">{title}</h3>
      <ul className="grid gap-2">
        {links.map((link) => (
          <li key={link.key}>
            <Link to={link.to} className="no-underline opacity-90 hover:underline hover:underline-offset-4 hover:opacity-100">
              {t(`footer.${link.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const { t } = useTranslation('layout')
  const socialLinks = useSocialLinks()
  return (
    <footer id="contact" className="overflow-hidden rounded-t-xl bg-forest text-on-forest">
      <div className="wrap grid grid-cols-2 gap-x-12 gap-y-8 pt-12 pb-12 lg:grid-cols-[1.3fr_1fr_1fr] lg:pt-20">
        <div className="col-span-2 lg:col-span-1">
          <h2 className="max-w-[18ch] text-[clamp(26px,3vw,40px)] leading-[1.35] font-semibold text-balance">
            {t('footer.supportTitle')}
          </h2>
          <p className="mt-3 mb-6 max-w-[40ch] opacity-90">{t('footer.supportBody')}</p>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                {...(s.href.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
                dir="ltr"
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm leading-none font-medium no-underline shadow-[inset_0_0_0_1.5px_rgb(241_240_233/0.4)] transition-colors hover:bg-on-forest hover:text-forest-deep"
              >
                <BrandIcon name={s.icon} className="size-[18px]" strokeWidth={1.6} />
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <FooterColumn title={t('footer.shop')} links={FOOTER_SHOP} />
        <FooterColumn title={t('footer.help')} links={FOOTER_HELP} />
      </div>
      <div
        aria-hidden="true"
        dir="ltr"
        className="-mb-[0.08em] text-center text-[clamp(40px,13vw,230px)] leading-[0.85] font-semibold tracking-[-0.03em] whitespace-nowrap text-forest-deep select-none"
      >
        Timber Glow
      </div>
      <div className="relative bg-forest-deep">
        <div className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 py-4 text-[13px]">
          <span>© 2026 Timber Glow</span>
          <nav className="flex gap-6">
            <a href="#" className="no-underline opacity-90 hover:underline hover:opacity-100">{t('footer.privacy')}</a>
            <a href="#" className="no-underline opacity-90 hover:underline hover:opacity-100">{t('footer.refund')}</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
