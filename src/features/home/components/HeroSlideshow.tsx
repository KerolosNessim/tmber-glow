import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { Highlight } from '@/shared/components/Highlight'
import { Button } from '@/shared/components/ui/button'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { pad2 } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { SLIDE_DURATION_MS } from '../constants/home.constants'
import { useSlideshow } from '../hooks/useSlideshow'
import type { HeroSlide } from '../types/home.types'

const arrowOnDark = 'size-10 md:size-11 border-[1.5px] border-on-forest/60'

/** Highlighted title words get a dashed "stitched" underline. */
const stitched = 'text-gold underline decoration-gold/60 decoration-dashed decoration-[1.5px] underline-offset-[0.2em]'

/** Dashes the progress track so it reads as a seam being sewn. */
const seam = '[mask-image:repeating-linear-gradient(90deg,#000_0_7px,transparent_7px_11px)]'

const gutter = { '--gutter': 'clamp(24px,4.5vw,72px)' } as CSSProperties

export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const { t } = useTranslation(['home', 'common'])
  const { l, isRtl } = useLocalized()
  const rootRef = useRef<HTMLElement>(null)
  const show = useSlideshow(slides.length, rootRef)

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={t('hero.label')}
      className="relative isolate overflow-hidden rounded-lg bg-forest-deep text-on-forest md:rounded-xl"
      style={gutter}
      {...show.rootHandlers}
      onTouchStart={show.swipeHandlers.onTouchStart}
      onTouchEnd={(e) => show.swipeHandlers.onTouchEnd(e, isRtl)}
    >
      {/* Slides share one grid cell: the next photo is revealed over the previous one */}
      <div className="grid">
        {slides.map((slide, i) => {
          const active = i === show.current
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}`}
              inert={!active}
              className={cn(
                'relative grid grid-cols-1 grid-rows-[auto_1fr] [grid-area:1/1] md:h-[clamp(540px,78vh,780px)] md:grid-cols-2 md:grid-rows-1',
                active ? 'z-10' : 'z-0',
              )}
            >
              <div
                className={cn(
                  'col-start-1 row-start-1 p-3 transition-opacity duration-300 md:col-start-2 md:p-4',
                  !active && 'opacity-0 delay-[1200ms]',
                )}
              >
                <div
                  className={cn(
                    'relative aspect-square size-full overflow-hidden rounded-[18px] bg-forest md:aspect-auto',
                    active && show.cycle > 0 && 'animate-reveal',
                  )}
                >
                  <img
                    src={slide.photo.src}
                    alt={l(slide.photo.alt)}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                    className={cn('size-full object-cover transition-transform duration-[7s] ease-linear', active && 'scale-[1.05]')}
                    style={{ objectPosition: slide.photo.focus }}
                  />
                  {/* Hang-tag: the fabric spec sits on the garment */}
                  <span
                    className={cn(
                      'spec absolute start-3 top-3 z-10 inline-flex items-center gap-2 rounded-md bg-gold py-1.5 ps-2.5 pe-3 text-forest-deep shadow-sm md:start-4 md:top-4',
                      slide.eyebrow.kind === 'new' && 'font-sans text-[13px] font-bold',
                    )}
                  >
                    <i className="size-1.5 shrink-0 rounded-full bg-forest-deep/70" aria-hidden="true" />
                    {slide.eyebrow.kind === 'spec' ? slide.eyebrow.text : t('common:badges.new')}
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  'col-start-1 row-start-2 flex items-center pt-4 pb-28 md:row-start-1 md:py-0 md:pb-24',
                  !active && 'opacity-0 transition-opacity duration-200',
                )}
              >
                <div
                  key={active ? `on-${show.cycle}` : 'off'}
                  className={cn(
                    'grid w-full justify-items-start gap-5 px-6 md:px-(--gutter)',
                    active && (show.cycle > 0 ? '*:animate-rise *:[animation-delay:.35s] [&>*:nth-child(2)]:[animation-delay:.45s] [&>*:nth-child(3)]:[animation-delay:.55s]' : '*:animate-rise [&>*:nth-child(2)]:[animation-delay:.1s] [&>*:nth-child(3)]:[animation-delay:.2s]'),
                  )}
                >
                  <h2 className="max-w-[11ch] text-[clamp(38px,5vw,76px)] leading-[1.3] font-semibold text-balance ltr:max-w-[12ch] ltr:leading-[1.02] ltr:tracking-[-0.025em]">
                    <Highlight text={l(slide.title)} className={stitched} />
                  </h2>
                  <p className="max-w-[38ch] text-[15px] text-on-forest/82 md:text-[17px]">{l(slide.body)}</p>
                  <Button asChild size="lg">
                    <Link to={slide.cta.to}>
                      {l(slide.cta.label)} <BrandIcon name="arrow" directional className="transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="absolute inset-x-5 bottom-[34px] z-20 flex items-center justify-between gap-4 md:inset-x-auto md:bottom-9 md:start-(--gutter) md:justify-start">
        <Button variant="onDark" size="icon-lg" className={arrowOnDark} aria-label={t('common:actions.previous')} onClick={show.prev}>
          <BrandIcon name="arrow" className="ltr:-scale-x-100" />
        </Button>
        <span className="min-w-16 text-center font-mono text-[13px] leading-none tabular-nums" dir="ltr">
          {pad2(show.current + 1)} / {pad2(slides.length)}
        </span>

        <Button variant="onDark" size="icon-lg" className={arrowOnDark} aria-label={t('common:actions.next')} onClick={show.next}>
          <BrandIcon name="arrow" directional />
        </Button>
      </div>

      {/* Slide picker: stitched progress on small screens, photo thumbnails on large ones */}
      <div className="absolute inset-x-5 bottom-3 z-20 grid auto-cols-fr grid-flow-col gap-1.5 md:inset-x-auto md:end-8 md:bottom-8 md:flex md:gap-2.5 md:rounded-2xl md:bg-forest-deep/60 md:p-2.5 md:backdrop-blur-md">
        {slides.map((slide, i) => {
          const current = i === show.current
          return (
            <button
              key={slide.id}
              type="button"
              aria-label={t('hero.slide', { n: i + 1 })}
              aria-current={current}
              onClick={() => show.go(i)}
              className="group/thumb flex h-[18px] cursor-pointer flex-col justify-end md:h-auto md:w-[68px] md:gap-2"
            >
              <span
                className={cn(
                  'hidden aspect-[3/4] overflow-hidden rounded-lg ring-2 transition-[opacity,box-shadow] duration-300 md:block',
                  current ? 'opacity-100 ring-gold' : 'opacity-60 ring-transparent group-hover/thumb:opacity-100',
                )}
              >
                <img src={slide.photo.src} alt="" loading="lazy" className="size-full object-cover" style={{ objectPosition: slide.photo.focus }} />
              </span>
              <span className={cn('relative block h-[3px] w-full overflow-hidden', seam)}>
                <i className="absolute inset-0 bg-on-forest/30" />
                <i
                  key={current ? show.cycle : 'idle'}
                  data-active={current}
                  className={cn(
                    'progress-fill absolute inset-0 scale-x-0 bg-gold',
                    i < show.current && 'scale-x-100',
                    current && 'animate-fill',
                    current && show.paused && '[animation-play-state:paused]',
                  )}
                  style={{ ['--slide-duration' as string]: `${SLIDE_DURATION_MS}ms` }}
                />
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
