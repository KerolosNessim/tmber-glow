import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { Footer } from '@/features/layout/components/Footer'
import { Header } from '@/features/layout/components/Header'
import { useUiStore } from '@/shared/store/ui.store'
import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

/** Scrolls to #hash targets (once the page has rendered them) or to the top on navigation. */
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()
  const closeMenu = useUiStore((s) => s.closeMenu)

  useEffect(() => {
    closeMenu()
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    let tries = 0
    const timer = window.setInterval(() => {
      const el = document.getElementById(hash.slice(1))
      if (el || ++tries > 20) {
        window.clearInterval(timer)
        el?.scrollIntoView()
      }
    }, 100)
    return () => window.clearInterval(timer)
  }, [pathname, hash, closeMenu])
}

export function RootLayout() {
  useScrollOnNavigate()
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
