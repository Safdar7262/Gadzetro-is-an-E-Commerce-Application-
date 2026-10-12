import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductListing from '../../components/products/ProductListing.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Loader from '../../components/common/Loader.jsx'
import Button from '../../components/common/Button.jsx'
import useCatalog from '../../hooks/useCatalog.js'

export default function CategoryPage() {
  const { categorySlug } = useParams()
  const { products, categories, brands, loading, error } = useCatalog()
  const category = categories.find((c) => c.slug === categorySlug)
  const categoryProducts = useMemo(() => products.filter((p) => p.categoryId === category?.id), [products, category])

  if (loading) return <div className="container page"><Loader label="Loading category..." /></div>
  if (!category) {
    return (
      <div className="container page">
        <EmptyState title="Category not found" message={error || 'This category does not exist.'} action={<Button to="/shop">Browse all products</Button>} />
      </div>
    )
  }

  return (
    <div className="container page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{category.name}</span></nav>
      <header className="page-header">
        {category.banner && <img className="category-banner" src={category.banner} alt={`${category.name} banner`} />}
        <h1 className="page-title">{category.name}</h1>
        <p>{category.description}</p>
      </header>
      <ProductListing key={category.id} products={categoryProducts} categories={categories} brands={brands} showCategoryFilter={false} loading={false} error={error} />
    </div>
  )
}
