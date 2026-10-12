import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parseFilters, toParams } from '../utils/productFilters.js'

// Filters live in the URL (?brand=sony&min=1000&sort=newest), so they survive refresh and can be shared.
export default function useListingFilters() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(params), [params])
  const q = params.get('q') || ''

  const update = (patch) => setParams(toParams({ ...filters, page: 1, ...patch }, q), { replace: true })

  const toggleList = (key, id) =>
    update({ [key]: filters[key].includes(id) ? filters[key].filter((x) => x !== id) : [...filters[key], id] })

  const clearAll = () => setParams(toParams(parseFilters(new URLSearchParams()), q), { replace: true })

  const removeFilter = (chip) => {
    if (chip.key === 'categories' || chip.key === 'brands') update({ [chip.key]: filters[chip.key].filter((x) => x !== chip.value) })
    else if (chip.key === 'price') update({ min: '', max: '' })
    else if (chip.key === 'rating') update({ rating: 0 })
    else if (chip.key === 'discount') update({ discount: 0 })
    else if (chip.key === 'inStock') update({ inStock: false })
  }

  return { filters, update, toggleList, clearAll, removeFilter }
}
