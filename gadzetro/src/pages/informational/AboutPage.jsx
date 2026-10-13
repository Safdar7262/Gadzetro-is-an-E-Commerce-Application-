import { Link } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import { categories } from '../../data/catalog/categories.js'
import '../../styles/info.css'

const values = [
  { title: 'Genuine products', text: 'We list gadgets from trusted brands so you know what you are buying.' },
  { title: 'Fair prices', text: 'Clear pricing with the discount shown next to the original price.' },
  { title: 'Reliable delivery', text: 'Clear delivery estimates and order status updates in your account.' },
  { title: 'Helpful support', text: 'Questions about an order or product? Our team is a message away.' },
]

export default function AboutPage() {
  return (
    <>
      <header className="info-hero">
        <div className="container">
          <h1>About Gadzetro</h1>
          <p>Smart gadgets for smarter living.</p>
        </div>
      </header>
      <div className="container page info">
        <p className="deal-note">Sample content. Replace the text below with your real store story before launch.</p>
        <section className="info-section">
          <h2>Our story</h2>
          <p>Gadzetro is an online store for smartphones, laptops, smartwatches, headphones, speakers, cameras, drones and everyday accessories. We want shopping for electronics to be simple: clear information, honest prices and an easy checkout.</p>
          <p>This site is a demo project, so the products, prices and reviews you see are sample data.</p>
        </section>

        <section className="info-section">
          <h2>Why shop with us</h2>
          <div className="values-grid">
            {values.map((v) => <article key={v.title} className="value-card"><h3>{v.title}</h3><p>{v.text}</p></article>)}
          </div>
        </section>

        <section className="info-section">
          <h2>What we sell</h2>
          <ul className="chip-row">
            {categories.map((c) => <li key={c.id}><Link to={`/category/${c.slug}`} className="chip">{c.name}</Link></li>)}
          </ul>
        </section>

        <div className="coming-soon-actions">
          <Button to="/shop">Start shopping</Button>
          <Button to="/contact" variant="outline">Contact us</Button>
        </div>
      </div>
    </>
  )
}