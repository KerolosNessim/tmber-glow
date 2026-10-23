import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'
import { SLIDE_DURATION_MS, SWIPE_THRESHOLD_PX } from '../constants/home.constants'

/**
 * Hero slideshow state. Autoplay stops on hover, keyboard focus, the pause
 * button, when the slideshow is off screen, and for reduced motion.
 */
export function useSlideshow(count: number, rootRef: React.RefObject<HTMLElement | null>) {
  const reduceMotion = usePrefersReducedMotion()
  const [current, setCurrent] = useState(0)
  /** Changes on every navigation so the progress bar animation restarts */
  const [cycle, setCycle] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [offscreen, setOffscreen] = useState(false)

  const paused = userPaused || reduceMotion || hovering || focused || offscreen

  const go = useCallback(
    (index: number) => {
      if (count === 0) return
      setCurrent(((index % count) + count) % count)
      setCycle((c) => c + 1)
    },
    [count],
  )
  const currentRef = useRef(current)
  currentRef.current = current
  const next = useCallback(() => go(currentRef.current + 1), [go])
  const prev = useCallback(() => go(currentRef.current - 1), [go])

  useEffect(() => {
    if (paused || count < 2) return
    const timer = window.setTimeout(() => go(current + 1), SLIDE_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [paused, current, cycle, count, go])

  useEffect(() => {
    const el = rootRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [rootRef])

  // Swipe
  const touchX = useRef<number | null>(null)
  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      touchX.current = e.touches[0].clientX
    },
    onTouchEnd: (e: React.TouchEvent, isRtl: boolean) => {
      if (touchX.current === null) return
      const dx = e.changedTouches[0].clientX - touchX.current
      touchX.current = null
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return
      if (isRtl ? dx > 0 : dx < 0) next()
      else prev()
    },
  }

  return {
    current,
    cycle,
    paused,
    userPaused: userPaused || reduceMotion,
    go,
    next,
    prev,
    togglePause: () => setUserPaused((p) => !p),
    rootHandlers: {
      // Mouse only: a tap on touch screens fires hover and would stall autoplay
      onPointerEnter: (e: React.PointerEvent) => setHovering(e.pointerType === 'mouse'),
      onPointerLeave: () => setHovering(false),
      // Keyboard focus only: clicking an arrow with the mouse must not stop autoplay
      onFocus: (e: React.FocusEvent) => setFocused(e.target.matches(':focus-visible')),
      onBlur: (e: React.FocusEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
      },
    },
    swipeHandlers,
  }
}
