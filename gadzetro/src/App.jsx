import HeroSection from './components/HeroSection.jsx'
import CategoriesSection from './components/CategoriesSection.jsx'
import ProductSection from './components/ProductSection.jsx'
import PromoBanner from './components/PromoBanner.jsx'
import BenefitsSection from './components/BenefitsSection.jsx'
import TopBrands from './components/TopBrands.jsx'
import Newsletter from './components/Newsletter.jsx'
import { banners } from './data/banners.js'

export default function App() {
  return (
    <>
    <CategoriesSection />
      <HeroSection />
      
      <ProductSection />
      <section className="container promo-grid" aria-label="Promotions">
        {banners.map((banner) => <PromoBanner key={banner.id} banner={banner} />)}
      </section>
      <ProductSection />
      <BenefitsSection />
      <TopBrands />
      {/* <Newsletter /> */}
    </>
  )
}