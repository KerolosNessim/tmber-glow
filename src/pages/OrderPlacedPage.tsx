import { useEffect, useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { LAST_ORDER_KEY, type PlacedOrder } from '@/features/checkout/services/order.service'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { Button } from '@/shared/components/ui/button'

type StoredOrder = PlacedOrder & { redirected?: boolean }

function readStored(number: string | undefined): StoredOrder | null {
  try {
    const stored = JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) ?? 'null') as StoredOrder | null
    return stored?.number === number ? stored : null
  } catch {
    return null
  }
}

/** Seconds before WhatsApp opens on its own, so the customer sees the order number first. */
const REDIRECT_DELAY_MS = 1500

/** /order/:number — order saved; one last step: send it on WhatsApp. */
export default function OrderPlacedPage() {
  const { t } = useTranslation('checkout')
  const { number } = useParams()
  const location = useLocation()
  const order = useMemo(() => readStored(number) ?? (location.state as StoredOrder | null), [number, location.state])
  const whatsappUrl = order?.whatsappUrl ?? null

  // Open WhatsApp once, automatically. Coming back to this page later doesn't redirect again.
  useEffect(() => {
    if (!whatsappUrl || order?.redirected) return
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ ...order, redirected: true }))
      } catch {
        // ignore
      }
      window.location.href = whatsappUrl
    }, REDIRECT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [whatsappUrl, order])

  return (
    <div className="wrap grid min-h-[60vh] content-center justify-items-center gap-6 py-section text-center">
      <span className="grid size-16 place-items-center rounded-full bg-forest-tint text-forest">
        <BrandIcon name="whatsapp" className="size-8" strokeWidth={1.6} />
      </span>
      <div className="grid gap-2">
        <h1 className="text-[clamp(28px,3vw,40px)] leading-tight font-semibold">{t('placed.title')}</h1>
        <p className="text-ink-muted">
          {t('placed.number')} <span className="spec text-base text-ink">#{number}</span>
        </p>
      </div>
      {whatsappUrl ? (
        <>
          <p className="max-w-[46ch] text-[17px]">{t('placed.body')}</p>
          <Button asChild size="lg">
            <a href={whatsappUrl}>
              <BrandIcon name="whatsapp" className="size-5" strokeWidth={1.6} />
              {t('placed.whatsapp')}
            </a>
          </Button>
          {!order?.redirected && <p className="text-sm text-ink-muted">{t('placed.redirecting')}</p>}
        </>
      ) : (
        <p className="max-w-[46ch] text-[17px]">{t('placed.noWhatsapp')}</p>
      )}
      <Link to="/collections" className="text-sm underline underline-offset-4 hover:text-ember-ink">
        {t('placed.continue')}
      </Link>
    </div>
  )
}
