import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductListing from '../../components/products/ProductListing.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Loader from '../../components/common/Loader.jsx'
import Button from '../../components/common/Button.jsx'
import useCatalog from '../../hooks/useCatalog.js'
import '../../styles/products.css'

export default function BrandDetailsPage() {
  const { brandSlug } = useParams()
  const { products, categories, brands, loading, error } = useCatalog()
  const brand = brands.find((b) => b.slug === brandSlug)
  const brandProducts = useMemo(() => products.filter((p) => p.brandId === brand?.id), [products, brand])

  if (loading) return <div className="container page"><Loader label="Loading brand..." /></div>
  if (!brand) {
    return (
      <div className="container page">
        <EmptyState title="Brand not found" message={error || 'This brand does not exist.'} action={<Button to="/brands">All brands</Button>} />
      </div>
    )
  }

  return (
    <div className="container page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/brands">Brands</Link> / <span>{brand.name}</span></nav>
      <header className="brand-hero">
        <h1>{brand.name}</h1>
        <p>{brand.description}</p>
      </header>
      <ProductListing key={brand.id} products={brandProducts} categories={categories} brands={brands} showBrandFilter={false} loading={false} error={error} />
    </div>
  )
}
