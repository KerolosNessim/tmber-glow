import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import SplitText from '@/shared/components/reactbits/SplitText'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { Button } from '@/shared/components/ui/button'
import { useLocalized } from '@/shared/hooks/useLocalized'
import type { HomeContent } from '../types/home.types'

/** Splits by words (never by letters) so Arabic letters stay joined. */
export function IntroSection({ intro }: { intro: HomeContent['intro'] }) {
  const { t } = useTranslation()
  const { l } = useLocalized()
  const parts = l(intro.title)
    .split(/\*([^*]+)\*/g)
    .map((p) => p.trim())

  return (
    <section className="pt-section pb-[calc(var(--section-gap)*0.6)] text-center">
      <div className="wrap grid justify-items-center gap-4">
        <span className="spec text-gold-ink">{intro.spec}</span>
        <h2 className="max-w-[22ch] text-[clamp(30px,4.6vw,60px)] leading-[1.3] font-semibold text-balance ltr:leading-[1.05] ltr:tracking-[-0.02em]">
          {parts.map((part, i) =>
            part ? (
              <span key={`${part}-${i}`}>
                {i > 0 && ' '}
                <SplitText
                  tag="span"
                  text={part}
                  splitType="words"
                  delay={90}
                  duration={1}
                  className={i % 2 === 1 ? 'text-ember-ink' : undefined}
                />
              </span>
            ) : null,
          )}
        </h2>
        <p className="max-w-[54ch] text-[17px] text-ink-muted">{l(intro.body)}</p>
        <Button asChild>
          <Link to="/collections">
            {t('actions.shopAll')} <BrandIcon name="arrow" directional />
          </Link>
        </Button>
      </div>
    </section>
  )
}
