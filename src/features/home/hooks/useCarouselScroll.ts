import { useCallback, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'

/** Arrow buttons scroll one tile; the counter follows native scrolling (works in RTL and LTR). */
export function useCarouselScroll(trackRef: React.RefObject<HTMLElement | null>, itemCount: number) {
  const reduceMotion = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(itemCount > 1)

  const step = useCallback(() => {
    const track = trackRef.current
    const first = track?.children[0] as HTMLElement | undefined
    if (!track || !first) return 0
    return first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || '0')
  }, [trackRef])

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const pos = Math.abs(track.scrollLeft)
    const s = step() || 1
    setIndex(Math.min(Math.round(pos / s), itemCount - 1))
    setCanPrev(pos > 4)
    setCanNext(pos < track.scrollWidth - track.clientWidth - 4)
  }, [trackRef, step, itemCount])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.scrollLeft = 0
    update()
    const onScroll = () => requestAnimationFrame(update)
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [trackRef, update])

  const scrollBy = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current
      if (!track) return
      const rtl = getComputedStyle(track).direction === 'rtl'
      track.scrollBy({ left: direction * (rtl ? -1 : 1) * step(), behavior: reduceMotion ? 'auto' : 'smooth' })
    },
    [trackRef, step, reduceMotion],
  )

  return { index, canPrev, canNext, scrollBy }
}
