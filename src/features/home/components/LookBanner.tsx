import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '@/features/catalog/hooks/useProducts'
import { useAddToCart } from '@/features/cart/hooks/useAddToCart'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { useParallax } from '../hooks/useParallax'
import type { LookSet } from '../types/home.types'
import { LookHotspot } from './LookHotspot'

/** Feature banner: the hoodie + pants set, with shop-the-look hotspots and a set price. */
export function LookBanner({ look }: { look: LookSet }) {
  const { t } = useTranslation(['home', 'common'])
  const { l, price } = useLocalized()
  const { data: products = [] } = useProducts({ ids: look.productIds })
  const addToCart = useAddToCart()
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  useParallax(parallaxRef)

  useEffect(() => {
    if (!openId) return
    const close = () => setOpenId(null)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('click', close)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [openId])

  const fullPrice = products.reduce((sum, p) => sum + p.price, 0)
  const [line1, ...rest] = look.title.split(' ')

  return (
    <div id="look" className="wrap mb-section">
      <section
        aria-labelledby="look-title"
        className="relative isolate grid grid-cols-1 overflow-hidden rounded-lg bg-forest-deep text-on-forest md:grid-cols-2 md:rounded-xl"
      >
        {/* z-10 lifts the hotspot cards above the text panel; only the photo layer is clipped */}
        <div className="relative z-10 col-start-1 row-start-1 aspect-[4/5] md:aspect-auto md:min-h-[640px]">
          <div className="absolute inset-0 overflow-hidden">
            <div ref={parallaxRef} className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
              <img
                src={look.photo.src}
                alt={l(look.photo.alt)}
                loading="lazy"
                className="size-full object-cover"
                style={{ objectPosition: look.photo.focus }}
              />
            </div>
          </div>
          {look.hotspots.map((h) => {
            const product = products.find((p) => p.id === h.productId)
            return product ? (
              <LookHotspot
                key={h.productId}
                hotspot={h}
                product={product}
                open={openId === h.productId}
                onToggle={() => setOpenId((id) => (id === h.productId ? null : h.productId))}
              />
            ) : null
          })}
        </div>

        <div className="col-start-1 row-start-2 flex items-center pt-8 pb-12 md:col-start-2 md:row-start-1 md:py-12">
          <div className="grid w-full max-w-[520px] justify-items-start gap-4 px-6 md:px-[clamp(24px,5vw,72px)]">
            <Badge variant="new">{t('common:badges.set')}</Badge>
            <h2
              id="look-title"
              lang="en"
              dir="ltr"
              className="text-[clamp(44px,6vw,96px)] leading-none font-semibold tracking-[-0.02em] text-gold rtl:text-right"
            >
              {line1}
              <br />
              {rest.join(' ')}
            </h2>
            <p className="text-[clamp(20px,2vw,26px)] leading-normal font-semibold">{l(look.subtitle)}</p>
            <ul className="my-2 w-full border-t border-on-forest/20">
              {products.map((p) => (
                <li key={p.id} className="flex justify-between gap-6 border-b border-on-forest/20 py-3">
                  <span>{l(p.name)}</span>
                  <span className="font-mono text-[15px] tabular-nums">{price(p.price)}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="spec text-gold">{t('look.setPrice')}</span>
              <strong className="text-[28px] leading-none font-bold tabular-nums">{price(look.setPrice)}</strong>
              {fullPrice > look.setPrice && <s className="text-base text-on-forest/70 tabular-nums">{price(fullPrice)}</s>}
            </div>
            <Button disabled={!products.length} onClick={() => addToCart(products)}>
              {t('look.addSet')} <BrandIcon name="arrow" directional />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
