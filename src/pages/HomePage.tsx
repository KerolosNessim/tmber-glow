import { BottomsGrid } from '@/features/home/components/BottomsGrid'
import { HeroSlideshow } from '@/features/home/components/HeroSlideshow'
import { HomeSkeleton } from '@/features/home/components/HomeSkeleton'
import { IntroSection } from '@/features/home/components/IntroSection'
import { LookBanner } from '@/features/home/components/LookBanner'
import { Lookbook } from '@/features/home/components/Lookbook'
import { PerksStrip } from '@/features/home/components/PerksStrip'
import { TopsCarousel } from '@/features/home/components/TopsCarousel'
import { useHomeContent } from '@/features/home/hooks/useHomeContent'
import { useCategories } from '@/features/catalog/hooks/useCategories'
import { ErrorMessage } from '@/shared/components/StatusMessage'

/** bar → header → hero → perks → intro → Tops → the set → Bottoms → #TimberGlow → footer */
export default function HomePage() {
  const home = useHomeContent()
  const tops = useCategories('tops')
  const bottoms = useCategories('bottoms')

  if (home.error) return <ErrorMessage onRetry={() => location.reload()} />
  if (!home.data) return <HomeSkeleton />

  const { slides, perks, intro, look, lookbook } = home.data
  return (
    <>
      <div className="wrap pt-3">
        <HeroSlideshow slides={slides} />
        <PerksStrip perks={perks} />
      </div>
      <IntroSection intro={intro} />
      {tops.data && <TopsCarousel categories={tops.data} />}
      <LookBanner look={look} />
      {bottoms.data && <BottomsGrid categories={bottoms.data} />}
      <Lookbook lookbook={lookbook} />
    </>
  )
}
