import { create } from 'zustand'

interface UiState {
  isCartOpen: boolean
  isMenuOpen: boolean
  isSearchOpen: boolean
  openCart: () => void
  closeCart: () => void
  setCartOpen: (open: boolean) => void
  toggleMenu: () => void
  setSearchOpen: (open: boolean) => void
  setMenuOpen: (open: boolean) => void
  closeMenu: () => void
}

/** App-wide UI state (drawers, menus). Shared through Zustand, not React context. */
export const useUiStore = create<UiState>()((set) => ({
  isCartOpen: false,
  isMenuOpen: false,
  isSearchOpen: false,
  openCart: () => set({ isCartOpen: true, isMenuOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set(open ? { isSearchOpen: true, isMenuOpen: false } : { isSearchOpen: false }),
  toggleMenu: () => set((s) => ({ isMenuOpen: !s.isMenuOpen })),
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  closeMenu: () => set({ isMenuOpen: false }),
}))
