import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import '../styles/Footer.css'

const quickLinks = [['Home', '#home'], ['Shop', '#deals'], ['Best Sellers', '#deals'], ['New Arrivals', '#deals'], ['Deals', '#deals']]
const serviceLinks = ['Contact Us', 'FAQs', 'Shipping Policy', 'Return Policy', 'Track Order']
const socials = [
  { label: 'Facebook', icon: <FaFacebookF /> },
  { label: 'Instagram', icon: <FaInstagram /> },
  { label: 'X (Twitter)', icon: <FaXTwitter /> },
  { label: 'YouTube', icon: <FaYoutube /> },
]

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container footer-grid">
        <div>
          <a href="#home" className="brand">
            <img src="/images/logo/logo.png" alt="" width="36" height="36" />
            <span>Gadzetro</span>
          </a>
          <p className="footer-about">Gadzetro is your one-stop store for smartphones, laptops, smartwatches, audio gear, cameras and accessories, with genuine products at fair prices.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>{quickLinks.map(([label, href]) => <li key={label}><a href={href}>{label}</a></li>)}</ul>
        </div>
        <div>
          <h4>Customer Service</h4>
          <ul>{serviceLinks.map((label) => <li key={label}><a href="#contact">{label}</a></li>)}</ul>
        </div>
        <div>
          <h4>Contact Information</h4>
          <ul className="contact-list">
            <li><FiMail /> support@gadzetro.example</li>
            <li><FiPhone /> +91 00000 00000</li>
            <li><FiMapPin /> Your Store Address, City, State</li>
          </ul>
          <div className="socials">
            {socials.map((s) => <a key={s.label} href="#contact" aria-label={s.label}>{s.icon}</a>)}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Gadzetro. All rights reserved.</p>
          <p><a href="#contact">Privacy Policy</a><a href="#contact">Terms and Conditions</a></p>
        </div>
      </div>
    </footer>
  )
}
