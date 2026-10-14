// Full catalog categories (slug = id). The older src/data/categories.js still feeds the homepage and is untouched.
import { loadFromStorage } from '../../utils/storage.js'
export const categories = [
  { id: 'smartphones', slug: 'smartphones', name: 'Smartphones', description: 'Latest 5G smartphones with great cameras and all-day battery.', image: '/images/categories/smartphones.png', banner: null },
  { id: 'laptops', slug: 'laptops', name: 'Laptops', description: 'Thin, fast laptops for work, study and entertainment.', image: '/images/categories/laptops.png', banner: null },
  { id: 'smartwatches', slug: 'smartwatches', name: 'Smartwatches', description: 'Fitness tracking, calls and notifications on your wrist.', image: '/images/categories/smartwatches.png', banner: '/images/products/smartwatch.jpg' },
  { id: 'headphones', slug: 'headphones', name: 'Headphones', description: 'Wireless earbuds and headphones for immersive sound.', image: '/images/categories/headphones.png', banner: '/images/banners/headphones-banner.jpg' },
  { id: 'speakers', slug: 'speakers', name: 'Speakers', description: 'Portable Bluetooth speakers with powerful bass.', image: '/images/categories/speakers.png', banner: null },
  { id: 'cameras', slug: 'cameras', name: 'Cameras', description: 'DSLR and vlogging cameras to capture every moment.', image: '/images/categories/cameras.png', banner: null },
  { id: 'drones', slug: 'drones', name: 'Drones', description: 'Compact camera drones for stunning aerial shots.', image: '/images/categories/drones.png', banner: null },
  { id: 'accessories', slug: 'accessories', name: 'Accessories', description: 'Power banks, chargers and everyday gadget accessories.', image: '/images/categories/accessories.png', banner: '/images/products/power-bank.jpg' },
]

// Admin edits are saved in localStorage and loaded here, so every page sees the same data.
const saved = loadFromStorage('catalog:categories', null)
if (Array.isArray(saved) && saved.length > 0) categories.splice(0, categories.length, ...saved)