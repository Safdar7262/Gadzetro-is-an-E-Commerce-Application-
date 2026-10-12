import { FiCheckCircle, FiTag, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi'
import '../styles/BenefitsSection.css'

const benefits = [
  { icon: <FiCheckCircle />, title: '100% Original', text: 'Genuine Products' },
  { icon: <FiTag />, title: 'Best Prices', text: 'Unbeatable Deals' },
  { icon: <FiTruck />, title: 'Fast Delivery', text: 'Quick & Reliable' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', text: 'Hassle-Free Returns' },
  { icon: <FiShield />, title: 'Secure Shopping', text: 'Your Data Is Safe' },
]

export default function BenefitsSection() {
  return (
    <section id="benefits" className="benefits">
      <ul className="container benefits-grid">
        {benefits.map((b) => (
          <li key={b.title}>
            <span className="benefit-icon">{b.icon}</span>
            <div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
