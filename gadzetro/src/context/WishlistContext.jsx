
// import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
// import { loadFromStorage, saveToStorage } from '../utils/storage.js'

// export const WishlistContext = createContext(null)

// // Stores product ids only (products come from the shared catalog). Persisted in localStorage.
// export function WishlistProvider({ children }) {
//   const [wishlistIds, setWishlistIds] = useState(() => loadFromStorage('wishlist', []))

//   useEffect(() => { saveToStorage('wishlist', wishlistIds) }, [wishlistIds])

//   const toggleWishlist = useCallback((id) => {
//     setWishlistIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
//   }, [])
//   const removeFromWishlist = useCallback((id) => setWishlistIds((prev) => prev.filter((x) => x !== id)), [])
//   const isInWishlist = useCallback((id) => wishlistIds.includes(id), [wishlistIds])

//   const value = useMemo(
//     () => ({ wishlistIds, wishlistCount: wishlistIds.length, isInWishlist, toggleWishlist, removeFromWishlist }),
//     [wishlistIds, isInWishlist, toggleWishlist, removeFromWishlist]
//   )
//   return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
// }



import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import useAuth from '../hooks/useAuth.js'
import { loadFromStorage, saveToStorage } from '../utils/storage.js'

export const WishlistContext = createContext(null)

// Stores product ids only (products come from the shared catalog). Persisted in localStorage.
export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.id || 'guest' // har account ki apni wishlist
  const [wishlistIds, setWishlistIds] = useState(() => loadFromStorage(`wishlist:${uid}`, []))
  const [loadedUid, setLoadedUid] = useState(uid)

  // Login / logout hone par us account ki wishlist load karo.
  useEffect(() => {
    if (loadedUid === uid) return
    setWishlistIds(loadFromStorage(`wishlist:${uid}`, []))
    setLoadedUid(uid)
  }, [uid, loadedUid])
  useEffect(() => { if (loadedUid === uid) saveToStorage(`wishlist:${uid}`, wishlistIds) }, [wishlistIds, uid, loadedUid])

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