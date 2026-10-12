import { SORT_OPTIONS } from '../../utils/productFilters.js'

export default function ProductSort({ value, onChange }) {
  return (
    <label className="sort-select">
      Sort by
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}
