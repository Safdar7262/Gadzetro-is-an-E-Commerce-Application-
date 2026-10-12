import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import '../../styles/Footer.css' // reuses the homepage footer styles

const quickLinks = [['Home', '/'], ['Shop', '/shop'], ['Best Sellers', '/shop?sort=popularity'], ['New Arrivals', '/shop?sort=newest'], ['Deals', '/deals']]
const serviceLinks = [['Contact Us', '/contact'], ['FAQs', '/faq'], ['Shipping Policy', '/shipping-policy'], ['Return Policy', '/return-policy'], ['Track Order', '/account/orders']]
const socials = [
  { label: 'Facebook', icon: <FaFacebookF /> },
  { label: 'Instagram', icon: <FaInstagram /> },
  { label: 'X (Twitter)', icon: <FaXTwitter /> },
  { label: 'YouTube', icon: <FaYoutube /> },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand">
            <img src="/images/logo/logo.png" alt="" width="36" height="36" />
            <span>Gadzetro</span>
          </Link>
          <p className="footer-about">Gadzetro is your one-stop store for smartphones, laptops, smartwatches, audio gear, cameras and accessories, with genuine products at fair prices.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>{quickLinks.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}</ul>
        </div>
        <div>
          <h4>Customer Service</h4>
          <ul>{serviceLinks.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}</ul>
        </div>
        <div>
          <h4>Contact Information</h4>
          <ul className="contact-list">
            <li><FiMail /> support@gadzetro.example</li>
            <li><FiPhone /> +91 00000 00000</li>
            <li><FiMapPin /> Your Store Address, City, State</li>
          </ul>
          <div className="socials">
            {/* Placeholder links: replace "/contact" with real social profile URLs */}
            {socials.map((s) => <Link key={s.label} to="/contact" aria-label={s.label}>{s.icon}</Link>)}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Gadzetro. All rights reserved.</p>
          <p><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms">Terms and Conditions</Link></p>
        </div>
      </div>
    </footer>
  )
}
