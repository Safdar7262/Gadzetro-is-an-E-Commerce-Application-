import { useMemo } from 'react'
import HeroSection from '../../components/HeroSection.jsx' // your original sections, reused as they are
import BenefitsSection from '../../components/BenefitsSection.jsx'
import TopBrands from '../../components/TopBrands.jsx'
import HomeCategories from '../../components/home/HomeCategories.jsx'
import ProductRail from '../../components/home/ProductRail.jsx'
import PromoBanners from '../../components/home/PromoBanners.jsx'
import useCatalog from '../../hooks/useCatalog.js'
import { calcDiscountPercent } from '../../utils/currency.js'

export default function HomePage() {
  const { products, loading, error } = useCatalog()

  const rails = useMemo(() => {
    const discountOf = (p) => calcDiscountPercent(p.price, p.originalPrice)
    return {
      deals: [...products].filter((p) => p.stock > 0).sort((a, b) => discountOf(b) - discountOf(a)).slice(0, 8),
      featured: products.filter((p) => p.isFeatured).slice(0, 4),
      newest: products.filter((p) => p.isNewArrival).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4),
      bestSellers: products.filter((p) => p.isBestSeller).sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4),
    }
  }, [products])

  return (
    <>
      <HeroSection />
      <HomeCategories />
      <ProductRail id="deals" alt title="Today's Best Deals" products={rails.deals} viewAllTo="/deals" loading={loading} error={error} />
      <PromoBanners />
      <ProductRail title="Featured Products" products={rails.featured} viewAllTo="/shop" loading={loading} error={error} />
      <ProductRail alt title="New Arrivals" products={rails.newest} viewAllTo="/shop?sort=newest" loading={loading} error={error} />
      <ProductRail title="Best Sellers" products={rails.bestSellers} viewAllTo="/shop?sort=popularity" loading={loading} error={error} />
      <BenefitsSection />
      <TopBrands />
    </>
  )
}