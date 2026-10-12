import { useEffect, useState } from 'react'
import { getProducts, getCategories, getBrands } from '../services/productService.js'

// Loads products, categories and brands through the service layer (mock now, Axios later).
export default function useCatalog() {
  const [state, setState] = useState({ products: [], categories: [], brands: [], loading: true, error: '' })

  useEffect(() => {
    let cancelled = false
    Promise.all([getProducts(), getCategories(), getBrands()])
      .then(([products, categories, brands]) => { if (!cancelled) setState({ products, categories, brands, loading: false, error: '' }) })
      .catch((err) => { if (!cancelled) setState((s) => ({ ...s, loading: false, error: err.message || 'Could not load products' })) })
    return () => { cancelled = true }
  }, [])

  return state
}
