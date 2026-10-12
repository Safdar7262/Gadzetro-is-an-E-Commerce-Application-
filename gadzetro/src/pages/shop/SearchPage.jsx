import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import ProductListing from '../../components/products/ProductListing.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'
import useCatalog from '../../hooks/useCatalog.js'
import { searchProducts } from '../../services/productService.js'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const { categories, brands } = useCatalog()
  const [input, setInput] = useState(q)
  const [state, setState] = useState({ products: [], loading: true, error: '' })

  useEffect(() => {
    let cancelled = false
    setInput(q)
    setState((s) => ({ ...s, loading: true, error: '' }))
    searchProducts(q)
      .then((products) => { if (!cancelled) setState({ products, loading: false, error: '' }) })
      .catch((err) => { if (!cancelled) setState({ products: [], loading: false, error: err.message || 'Search failed' }) })
    return () => { cancelled = true }
  }, [q])

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = new URLSearchParams()
    if (input.trim()) next.set('q', input.trim())
    setParams(next)
  }

  const noResults = (
    <EmptyState icon={<FiSearch />} title={`No results for "${q}"`} message="Check the spelling, try fewer words, or browse a popular category."
      action={
        <>
          <div className="suggestions">
            {categories.slice(0, 6).map((c) => <Link key={c.id} to={`/category/${c.slug}`} className="chip">{c.name}</Link>)}
          </div>
          <Button to="/shop">Browse all products</Button>
        </>
      } />
  )

  return (
    <div className="container page">
      <header className="page-header">
        <h1 className="page-title">{q ? `Search results for "${q}"` : 'Search products'}</h1>
        <form className="search-form" onSubmit={handleSubmit} role="search">
          <input type="search" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search by name, brand or category" aria-label="Search products" />
          <Button type="submit">Search</Button>
        </form>
      </header>
      <ProductListing products={state.products} categories={categories} brands={brands} loading={state.loading} error={state.error} noResults={noResults} />
    </div>
  )
}
