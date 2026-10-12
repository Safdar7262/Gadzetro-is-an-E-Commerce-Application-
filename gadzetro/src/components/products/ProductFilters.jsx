const RATING_OPTIONS = [4, 3, 2]
const DISCOUNT_OPTIONS = [10, 25, 40]
const digitsOnly = (value) => value.replace(/\D/g, '')

export default function ProductFilters({ filters, update, toggleList, clearAll, hasFilters, categoryOptions, brandOptions, showCategories, showBrands }) {
  return (
    <div className="filters">
      <div className="filters-head">
        <h2>Filters</h2>
        {hasFilters && <button type="button" className="chip-clear" onClick={clearAll}>Clear all</button>}
      </div>

      {showCategories && categoryOptions.length > 0 && (
        <fieldset className="filter-group">
          <legend>Category</legend>
          {categoryOptions.map((c) => (
            <label key={c.id} className="filter-option">
              <input type="checkbox" checked={filters.categories.includes(c.id)} onChange={() => toggleList('categories', c.id)} />
              {c.name}<span className="count">{c.count}</span>
            </label>
          ))}
        </fieldset>
      )}

      <fieldset className="filter-group">
        <legend>Price (₹)</legend>
        <div className="price-inputs">
          <input type="text" inputMode="numeric" placeholder="Min" aria-label="Minimum price" value={filters.min} onChange={(e) => update({ min: digitsOnly(e.target.value) })} />
          <span>to</span>
          <input type="text" inputMode="numeric" placeholder="Max" aria-label="Maximum price" value={filters.max} onChange={(e) => update({ max: digitsOnly(e.target.value) })} />
        </div>
      </fieldset>

      {showBrands && brandOptions.length > 0 && (
        <fieldset className="filter-group">
          <legend>Brand</legend>
          {brandOptions.map((b) => (
            <label key={b.id} className="filter-option">
              <input type="checkbox" checked={filters.brands.includes(b.id)} onChange={() => toggleList('brands', b.id)} />
              {b.name}<span className="count">{b.count}</span>
            </label>
          ))}
        </fieldset>
      )}

      <fieldset className="filter-group">
        <legend>Rating</legend>
        <label className="filter-option"><input type="radio" name="rating" checked={filters.rating === 0} onChange={() => update({ rating: 0 })} />Any rating</label>
        {RATING_OPTIONS.map((r) => (
          <label key={r} className="filter-option"><input type="radio" name="rating" checked={filters.rating === r} onChange={() => update({ rating: r })} />{r}★ &amp; up</label>
        ))}
      </fieldset>

      <fieldset className="filter-group">
        <legend>Availability</legend>
        <label className="filter-option"><input type="checkbox" checked={filters.inStock} onChange={(e) => update({ inStock: e.target.checked })} />In stock only</label>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Discount</legend>
        <label className="filter-option"><input type="radio" name="discount" checked={filters.discount === 0} onChange={() => update({ discount: 0 })} />Any discount</label>
        {DISCOUNT_OPTIONS.map((d) => (
          <label key={d} className="filter-option"><input type="radio" name="discount" checked={filters.discount === d} onChange={() => update({ discount: d })} />{d}% or more</label>
        ))}
      </fieldset>
    </div>
  )
}
