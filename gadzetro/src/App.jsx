import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import CategoriesSection from './components/CategoriesSection.jsx'
import ProductSection from './components/ProductSection.jsx'
import PromoBanner from './components/PromoBanner.jsx'
import BenefitsSection from './components/BenefitsSection.jsx'
import TopBrands from './components/TopBrands.jsx'
import Newsletter from './components/Newsletter.jsx'
import Footer from './components/Footer.jsx'
import { banners } from './data/banners.js'

export default function App() {
  // Search + category filter live here so Navbar, Categories, Products and Banners share them.
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} category={category} setCategory={setCategory} />
      <main>
        <HeroSection />
        <CategoriesSection category={category} setCategory={setCategory} />
        <ProductSection category={category} setCategory={setCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <section className="container promo-grid" aria-label="Promotions">
          {banners.map((banner) => (
            <PromoBanner key={banner.id} banner={banner} onSelectCategory={setCategory} />
          ))}
        </section>
        <BenefitsSection />
        <TopBrands />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
