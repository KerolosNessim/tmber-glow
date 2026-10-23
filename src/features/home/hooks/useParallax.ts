import { useEffect } from 'react'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'
import { PARALLAX_STRENGTH } from '../constants/home.constants'

/** Moves `targetRef` slightly against the scroll while its parent is on screen. */
export function useParallax(targetRef: React.RefObject<HTMLElement | null>) {
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = targetRef.current
    if (!el || reduceMotion) return
    let ticking = false
    const onScroll = () => {
      const box = el.parentElement!.getBoundingClientRect()
      const p = (box.top + box.height / 2 - innerHeight / 2) / innerHeight
      el.style.transform = `translateY(${(p * -PARALLAX_STRENGTH).toFixed(2)}%)`
      ticking = false
    }
    const request = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(onScroll)
      }
    }
    onScroll()
    window.addEventListener('scroll', request, { passive: true })
    return () => window.removeEventListener('scroll', request)
  }, [targetRef, reduceMotion])
}
