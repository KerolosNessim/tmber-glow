import { useTranslation } from 'react-i18next'
import AnimatedContent from '@/shared/components/reactbits/AnimatedContent'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { Button } from '@/shared/components/ui/button'
import { useLocalized } from '@/shared/hooks/useLocalized'
import type { HomeContent } from '../types/home.types'

export function Lookbook({ lookbook }: { lookbook: HomeContent['lookbook'] }) {
  const { t } = useTranslation('home')
  const { l } = useLocalized()

  return (
    <section aria-labelledby="gram-title" className="pb-section">
      <div className="wrap">
        <SectionHeader
          id="gram-title"
          title={t('lookbook.title')}
          subtitle={t('lookbook.subtitle')}
          action={
            <Button asChild variant="outline" size="sm">
              <a href="#">
                <span dir="ltr">{lookbook.handle}</span> <BrandIcon name="arrow" directional />
              </a>
            </Button>
          }
        />
        <AnimatedContent distance={36} duration={1} stagger={0.08} className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {lookbook.posts.map((post) => (
            <a
              key={post.id}
              href={post.href}
              aria-label={l(post.photo.alt)}
              className="group relative block aspect-[4/5] overflow-hidden rounded-lg border border-line bg-surface-sunken after:absolute after:inset-0 after:bg-forest-deep/35 after:opacity-0 after:transition-opacity hover:after:opacity-100"
            >
              <img
                src={post.photo.src}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-1000 ease-brand group-hover:scale-105"
                style={{ objectPosition: post.photo.focus }}
              />
              <BrandIcon
                name="instagram"
                strokeWidth={1.6}
                className="absolute top-1/2 left-1/2 z-[1] size-9 -translate-1/2 text-white opacity-0 transition-opacity group-hover:opacity-100"
              />
            </a>
          ))}
        </AnimatedContent>
      </div>
    </section>
  )
}
