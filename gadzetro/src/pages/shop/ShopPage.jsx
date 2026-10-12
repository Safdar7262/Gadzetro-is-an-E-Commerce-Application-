import ProductListing from '../../components/products/ProductListing.jsx'
import useCatalog from '../../hooks/useCatalog.js'

export default function ShopPage() {
  const { products, categories, brands, loading, error } = useCatalog()
  return (
    <div className="container page">
      <header className="page-header">
        <h1 className="page-title">Shop</h1>
        <p>Browse all gadgets. Use the filters to narrow down by category, brand, price, rating and more.</p>
      </header>
      <ProductListing products={products} categories={categories} brands={brands} loading={loading} error={error} />
    </div>
  )
}
