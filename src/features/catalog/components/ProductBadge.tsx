import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/badge'
import type { ProductBadge as Kind } from '../types/catalog.types'

export function ProductBadge({ kind, className }: { kind: Kind; className?: string }) {
  const { t } = useTranslation()
  return (
    <Badge variant={kind === 'new' ? 'new' : 'cotton'} className={className}>
      {t(`badges.${kind}`)}
    </Badge>
  )
}
