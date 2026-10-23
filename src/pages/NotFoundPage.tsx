import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { Button } from '@/shared/components/ui/button'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="wrap grid justify-items-center gap-4 py-section text-center">
      <span className="spec text-gold-ink">404</span>
      <h1 className="text-[clamp(28px,4vw,48px)] font-semibold">{t('notFound.title')}</h1>
      <p className="text-ink-muted">{t('notFound.body')}</p>
      <Button asChild>
        <Link to="/">
          {t('actions.backHome')} <BrandIcon name="arrow" directional />
        </Link>
      </Button>
    </div>
  )
}
