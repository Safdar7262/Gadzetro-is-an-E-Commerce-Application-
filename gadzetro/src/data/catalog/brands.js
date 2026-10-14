import { loadFromStorage } from '../../utils/storage.js'

const brand = (id, name, color) => ({
  id, slug: id, name, color, banner: null,
  description: `Shop ${name} gadgets on Gadzetro. (Sample description for demo purposes.)`,
})

export const brands = [
  brand('apple', 'Apple', '#111827'),
  brand('samsung', 'Samsung', '#1428a0'),
  brand('boat', 'boAt', '#d71920'),
  brand('sony', 'Sony', '#111827'),
  brand('jbl', 'JBL', '#e8590c'),
  brand('oneplus', 'OnePlus', '#d71920'),
  brand('xiaomi', 'Xiaomi', '#ff6900'),
  brand('realme', 'realme', '#b8860b'),
  brand('canon', 'Canon', '#c1121f'),
  brand('dji', 'DJI', '#111827'),
  brand('fire-boltt', 'Fire-Boltt', '#1e6bff'),
  brand('gadzetro', 'Gadzetro', '#1e6bff'),
]


// Admin edits are saved in localStorage and loaded here, so every page sees the same data.
const saved = loadFromStorage('catalog:brands', null)
if (Array.isArray(saved) && saved.length > 0) brands.splice(0, brands.length, ...saved)