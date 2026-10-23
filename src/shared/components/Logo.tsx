import { Link } from 'react-router'
import { cn } from '@/shared/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label="Timber Glow" className={cn('flex items-center gap-3', className)}>
      <img src="/images/tg-mark.png" alt="" className="h-6.5 w-auto lg:h-8" width={120} height={68} />
    </Link>
  )
}
