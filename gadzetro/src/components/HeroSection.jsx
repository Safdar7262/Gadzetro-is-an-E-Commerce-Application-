import { FiTruck, FiRefreshCw, FiLock, FiHeadphones } from 'react-icons/fi'
import '../styles/HeroSection.css'

const perks = [
  { icon: <FiTruck />, text: 'Free Shipping' },
  { icon: <FiRefreshCw />, text: 'Easy Returns' },
  { icon: <FiLock />, text: 'Secure Payments' },
  { icon: <FiHeadphones />, text: '24/7 Support' },
]

export default function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="hero-kicker">LATEST TECH, BEST DEALS</p>
          <h1>Smart Gadgets for Smarter Living.</h1>
          <p className="hero-desc">Explore the latest gadgets with amazing features and unbeatable prices.</p>
          <div className="hero-buttons">
            <a href="#deals" className="btn btn-primary">Shop Now</a>
            <a href="#categories" className="btn btn-outline">Explore Categories</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-glow" />
          <img src="/images/hero/hero-gadgets.png" alt="Smartphone, smartwatch, headphones and speaker" />
        </div>
      </div>
      <ul className="container hero-perks">
        {perks.map((perk) => (
          <li key={perk.text}>{perk.icon}<span>{perk.text}</span></li>
        ))}
      </ul>
    </section>
  )
}
