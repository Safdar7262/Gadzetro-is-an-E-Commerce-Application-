import { useMemo, useState } from 'react'
import ProductGrid from './ProductGrid.jsx'
import ProductFilters from './ProductFilters.jsx'
import ProductSort from './ProductSort.jsx'
import Pagination from '../common/Pagination.jsx'
import EmptyState from '../common/EmptyState.jsx'
import Button from '../common/Button.jsx'
import useListingFilters from '../../hooks/useListingFilters.js'
import { PAGE_SIZE, applyFilters, getActiveFilters, sortProducts } from '../../utils/productFilters.js'
import '../../styles/products.css'

// Shared by Shop, Category, Search and Brand pages: filters + sort + chips + pagination in one component.
export default function ProductListing({ products, loading, error, categories, brands, showCategoryFilter = true, showBrandFilter = true, noResults }) {
  const { filters, update, toggleList, clearAll, removeFilter } = useListingFilters()
  const [panelOpen, setPanelOpen] = useState(false)

  const filtered = useMemo(() => sortProducts(applyFilters(products, filters), filters.sort), [products, filters])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(filters.page, totalPages)
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const chips = getActiveFilters(filters, { categories, brands })

  // Filter options only list categories/brands that exist in the current product list, with counts.
  const categoryOptions = useMemo(
    () => categories.map((c) => ({ ...c, count: products.filter((p) => p.categoryId === c.id).length })).filter((c) => c.count > 0),
    [categories, products]
  )
  const brandOptions = useMemo(
    () => brands.map((b) => ({ ...b, count: products.filter((p) => p.brandId === b.id).length })).filter((b) => b.count > 0),
    [brands, products]
  )

  const defaultEmpty = (
    <EmptyState title="No products match your filters" message="Try removing some filters or widening the price range."
      action={chips.length > 0 ? <Button onClick={clearAll}>Clear all filters</Button> : null} />
  )
  const empty = chips.length === 0 && noResults ? noResults : defaultEmpty

  return (
    <div className="listing">
      <aside className={`listing-filters ${panelOpen ? 'open' : ''}`} aria-label="Product filters">
        <ProductFilters filters={filters} update={update} toggleList={toggleList} clearAll={clearAll} hasFilters={chips.length > 0}
          categoryOptions={categoryOptions} brandOptions={brandOptions} showCategories={showCategoryFilter} showBrands={showBrandFilter} />
      </aside>

      <div className="listing-main">
        <div className="listing-toolbar">
          <button type="button" className="ui-btn ui-btn-outline ui-btn-sm filter-toggle" onClick={() => setPanelOpen(!panelOpen)} aria-expanded={panelOpen}>
            {panelOpen ? 'Hide filters' : `Filters${chips.length ? ` (${chips.length})` : ''}`}
          </button>
          <p className="count" aria-live="polite">{loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}</p>
          <ProductSort value={filters.sort} onChange={(sort) => update({ sort })} />
        </div>

        {chips.length > 0 && (
          <div className="chips" aria-label="Active filters">
            {chips.map((chip) => (
              <button key={`${chip.key}-${chip.value}`} type="button" className="chip" onClick={() => removeFilter(chip)} aria-label={`Remove filter ${chip.label}`}>{chip.label} ✕</button>
            ))}
            <button type="button" className="chip-clear" onClick={clearAll}>Clear all filters</button>
          </div>
        )}

        <ProductGrid products={visible} loading={loading} error={error} empty={empty} />
        <Pagination page={page} totalPages={totalPages} onChange={(p) => { update({ page: p }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
      </div>
    </div>
  )
}
