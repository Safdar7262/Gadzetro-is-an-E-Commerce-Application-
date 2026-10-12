import { FiAlertTriangle } from 'react-icons/fi'
import ProductCard from './ProductCard.jsx'
import Loader from '../common/Loader.jsx'
import EmptyState from '../common/EmptyState.jsx'
import Button from '../common/Button.jsx'

// Handles loading, error and empty states in one place so pages stay simple.
export default function ProductGrid({ products, loading = false, error = '', empty }) {
  if (loading) return <Loader label="Loading products..." />
  if (error) {
    return (
      <EmptyState icon={<FiAlertTriangle />} title="Could not load products" message={error}
        action={<Button onClick={() => window.location.reload()}>Try again</Button>} />
    )
  }
  if (products.length === 0) return empty || <EmptyState title="No products found" message="Try a different search or filter." />
  return (
    <div className="listing-grid">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
