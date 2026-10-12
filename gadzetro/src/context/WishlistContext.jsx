import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage.js'

export const WishlistContext = createContext(null)

// Stores product ids only (products come from the shared catalog). Persisted in localStorage.
export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(() => loadFromStorage('wishlist', []))

  useEffect(() => { saveToStorage('wishlist', wishlistIds) }, [wishlistIds])

  const toggleWishlist = useCallback((id) => {
    setWishlistIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])
  const removeFromWishlist = useCallback((id) => setWishlistIds((prev) => prev.filter((x) => x !== id)), [])
  const isInWishlist = useCallback((id) => wishlistIds.includes(id), [wishlistIds])

  const value = useMemo(
    () => ({ wishlistIds, wishlistCount: wishlistIds.length, isInWishlist, toggleWishlist, removeFromWishlist }),
    [wishlistIds, isInWishlist, toggleWishlist, removeFromWishlist]
  )
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
