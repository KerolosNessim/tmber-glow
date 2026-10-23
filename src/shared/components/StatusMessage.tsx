import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'

export function ErrorMessage({ onRetry }: { onRetry?: () => void }) {
  const { t } = useTranslation()
  return (
    <div role="alert" className="wrap grid justify-items-center gap-4 py-section text-center text-ink-muted">
      <p>{t('states.error')}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t('actions.retry')}
        </Button>
      )}
    </div>
  )
}
