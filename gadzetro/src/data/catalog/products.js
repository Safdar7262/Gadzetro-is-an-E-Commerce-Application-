// Single product source for the whole app (shop, search, details, cart, wishlist, admin demo).
// The 6 homepage products keep their original ids/prices, so cart items from the homepage match this catalog.
// All names, prices, specs and reviews are SAMPLE data for demonstration only.
import { products as homeProducts } from '../products.js'

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const BLURB = {
  smartphones: 'A feature-packed smartphone with a bright display, fast performance and a capable camera.',
  laptops: 'A portable laptop built for everyday work, study and entertainment.',
  smartwatches: 'A smartwatch with fitness tracking, notifications and a long-lasting battery.',
  headphones: 'Wireless audio with clear sound, comfortable fit and reliable battery life.',
  speakers: 'A portable Bluetooth speaker with punchy sound and a durable build.',
  cameras: 'A camera that delivers sharp photos and smooth video for creators.',
  drones: 'A compact drone with a stabilised camera and simple flight controls.',
  accessories: 'A dependable accessory to keep your gadgets powered and protected.',
}
const SPECS = {
  smartphones: { Display: '6.5-inch display', Battery: '5000 mAh', Connectivity: '5G, Wi-Fi, Bluetooth' },
  laptops: { Display: '15.6-inch display', Memory: '8 GB RAM', Storage: '512 GB SSD' },
  smartwatches: { Display: 'AMOLED touch display', Battery: 'Up to 7 days', Features: 'Heart rate, SpO2, calls' },
  headphones: { Connectivity: 'Bluetooth 5.x', 'Battery life': 'Up to 30 hours', Features: 'Built-in mic' },
  speakers: { Connectivity: 'Bluetooth 5.x', 'Battery life': 'Up to 12 hours', Rating: 'Splash resistant' },
  cameras: { Sensor: 'APS-C CMOS', Video: 'Full HD / 4K', Connectivity: 'Wi-Fi, USB' },
  drones: { Camera: '4K stabilised', 'Flight time': 'Up to 30 minutes', Range: 'Up to 6 km' },
  accessories: { Output: 'Fast charging', Ports: 'USB-A, USB-C', Safety: 'Over-charge protection' },
}
const HIGHLIGHTS = {
  smartphones: ['Smooth high-refresh display', 'All-day battery with fast charging', 'Capable dual camera system'],
  laptops: ['Lightweight and portable', 'Fast SSD storage', 'Full-size keyboard'],
  smartwatches: ['Health and fitness tracking', 'Bluetooth calling', 'Water resistant'],
  headphones: ['Clear, balanced sound', 'Long battery life', 'Quick pairing'],
  speakers: ['Loud, clear sound', 'Portable and rugged', 'Quick Bluetooth pairing'],
  cameras: ['Sharp image quality', 'Easy sharing over Wi-Fi', 'Beginner friendly'],
  drones: ['Stable aerial video', 'Foldable and portable', 'Easy flight modes'],
  accessories: ['Reliable fast charging', 'Compact design', 'Built-in safety protection'],
}

const FEATURED = [1, 2, 3, 4, 7, 11, 14, 16, 21, 23]
const BEST_SELLERS = [1, 2, 5, 8, 10, 15, 17, 19, 25]
const NEW_ARRIVALS = [6, 9, 12, 13, 20, 22, 24, 26, 27]

// Main image + two close-up views (files: name.jpg, name-2.jpg, name-3.jpg)
const gallery = (img) => [img, img.replace('.jpg', '-2.jpg'), img.replace('.jpg', '-3.jpg')]

const build = (p) => ({
  id: p.id,
  slug: slugify(p.name),
  name: p.name,
  description: `${p.name}. ${BLURB[p.categoryId]} (Sample description for demo purposes.)`,
  brandId: p.brandId,
  categoryId: p.categoryId,
  price: p.price,
  originalPrice: p.originalPrice,
  rating: p.rating,
  reviewCount: p.reviews,
  stock: p.stock,
  image: p.image, // first image, also kept for cart items
  category: p.categoryId, // kept for compatibility with homepage cart items
  images: gallery(p.image),
  specifications: { ...SPECS[p.categoryId], Warranty: '1 year (sample)' },
  highlights: HIGHLIGHTS[p.categoryId],
  isFeatured: FEATURED.includes(p.id),
  isBestSeller: BEST_SELLERS.includes(p.id),
  isNewArrival: NEW_ARRIVALS.includes(p.id),
  createdAt: new Date(Date.UTC(2026, 0, 1) + p.id * 6 * 86400000).toISOString().slice(0, 10),
  status: 'active',
})

const HOME_BRAND = { 1: 'boat', 2: 'fire-boltt', 3: 'jbl', 4: 'canon', 5: 'gadzetro', 6: 'dji' }
const HOME_STOCK = { 1: 150, 2: 90, 3: 40, 4: 12, 5: 200, 6: 8 }

const fromHome = homeProducts.map((h) =>
  build({ id: h.id, name: h.name, categoryId: h.category, brandId: HOME_BRAND[h.id], price: h.price, originalPrice: h.originalPrice, rating: h.rating, reviews: h.reviewCount ?? h.reviews, stock: HOME_STOCK[h.id], image: h.image })
)

const IMG = {
  smartphones: '/images/products/smartphone.jpg', laptops: '/images/products/laptop.jpg', smartwatches: '/images/products/smartwatch.jpg',
  headphones: '/images/products/headphones.jpg', earbuds: '/images/products/earbuds.jpg', speakers: '/images/products/speaker.jpg',
  cameras: '/images/products/camera.jpg', accessories: '/images/products/power-bank.jpg',
}
// [id, name, brandId, categoryId, price, originalPrice, rating, reviews, stock, image]
const rows = [
  [7, 'OnePlus Nord CE 5G (8GB/128GB)', 'oneplus', 'smartphones', 24999, 29999, 4.3, 18420, 35, IMG.smartphones],
  [8, 'Samsung Galaxy M-Series 5G (6GB/128GB)', 'samsung', 'smartphones', 15999, 21999, 4.2, 40123, 60, IMG.smartphones],
  [9, 'Xiaomi Redmi Note 5G (8GB/256GB)', 'xiaomi', 'smartphones', 17999, 22999, 4.4, 29876, 0, IMG.smartphones],
  [10, 'realme Narzo 5G (6GB/128GB)', 'realme', 'smartphones', 13499, 17999, 4.1, 22310, 80, IMG.smartphones],
  [11, 'Apple iPhone (128GB)', 'apple', 'smartphones', 59900, 64900, 4.7, 51200, 12, IMG.smartphones],
  [12, 'Xiaomi RedmiBook 15 Laptop', 'xiaomi', 'laptops', 38990, 52999, 4.2, 7420, 22, IMG.laptops],
  [13, 'Samsung Galaxy Book Laptop', 'samsung', 'laptops', 54990, 72990, 4.4, 3120, 9, IMG.laptops],
  [14, 'Apple MacBook Air (M-series)', 'apple', 'laptops', 89900, 99900, 4.8, 6840, 7, IMG.laptops],
  [15, 'OnePlus Buds Z2 Wireless Earbuds', 'oneplus', 'headphones', 3999, 4999, 4.3, 28210, 120, IMG.earbuds],
  [16, 'Sony WH-CH520 Wireless Headphones', 'sony', 'headphones', 3990, 5990, 4.4, 16320, 40, IMG.headphones],
  [17, 'boAt Rockerz 450 Bluetooth Headphones', 'boat', 'headphones', 1499, 3990, 4.2, 88450, 150, IMG.headphones],
  [18, 'Sony SRS-XB100 Portable Speaker', 'sony', 'speakers', 4990, 6990, 4.5, 9210, 30, IMG.speakers],
  [19, 'boAt Stone 352 Bluetooth Speaker', 'boat', 'speakers', 1199, 2990, 4.1, 41200, 90, IMG.speakers],
  [20, 'realme Watch 3 Smartwatch', 'realme', 'smartwatches', 3499, 4999, 4.0, 12890, 55, IMG.smartwatches],
  [21, 'Samsung Galaxy Watch Smartwatch', 'samsung', 'smartwatches', 18999, 24999, 4.5, 4210, 14, IMG.smartwatches],
  [22, 'Xiaomi Smart Band Fitness Tracker', 'xiaomi', 'smartwatches', 2999, 3999, 4.3, 35640, 70, IMG.smartwatches],
  [23, 'Sony ZV-1F Vlog Camera', 'sony', 'cameras', 54990, 59990, 4.6, 1320, 6, IMG.cameras],
  [24, 'Apple MagSafe Wireless Charger', 'apple', 'accessories', 3900, 4500, 4.4, 5420, 45, IMG.accessories],
  [25, 'Xiaomi 33W Fast Wall Charger', 'xiaomi', 'accessories', 999, 1499, 4.3, 25400, 200, IMG.accessories],
  [26, 'JBL Tune 510BT Wireless Headphones', 'jbl', 'headphones', 2999, 4999, 4.4, 54210, 85, IMG.headphones],
  [27, 'JBL Flip Essential 2 Speaker', 'jbl', 'speakers', 8999, 10999, 4.5, 6540, 25, IMG.speakers],
]
const fromRows = rows.map(([id, name, brandId, categoryId, price, originalPrice, rating, reviews, stock, image]) =>
  build({ id, name, brandId, categoryId, price, originalPrice, rating, reviews, stock, image })
)

export const products = [...fromHome, ...fromRows]
