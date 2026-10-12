import { useCallback, useState } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage.js'

export default function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState(() => loadFromStorage('recentlyViewed', []))

  const addRecentlyViewed = useCallback((id) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 8)
      saveToStorage('recentlyViewed', next)
      return next
    })
  }, [])

  return { recentIds, addRecentlyViewed }
}
