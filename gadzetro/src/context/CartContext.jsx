import { createContext, useCallback, useMemo, useState } from 'react'

export const CartContext = createContext(null)

// Cart item shape: { ...product, qty }. Product id is the unique identifier.
export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addToCart = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item))
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }, [])

  const cartCount = items.reduce((total, item) => total + item.qty, 0)
  const value = useMemo(() => ({ items, addToCart, cartCount }), [items, addToCart, cartCount])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
