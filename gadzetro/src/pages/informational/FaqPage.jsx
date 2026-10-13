import { Link } from 'react-router-dom'
import { faqCategories } from '../../data/faqs.js'
import '../../styles/info.css'

export default function FaqPage() {
  return (
    <div className="container page info">
      <header className="page-header">
        <h1 className="page-title">Frequently asked questions</h1>
        <p className="deal-note">Sample answers for demonstration. Replace with your real store answers.</p>
        <ul className="chip-row" aria-label="Jump to a topic">
          {faqCategories.map((c) => <li key={c.id}><a href={`#faq-${c.id}`} className="chip">{c.title}</a></li>)}
        </ul>
      </header>

      {faqCategories.map((category) => (
        <section key={category.id} id={`faq-${category.id}`} className="faq-group">
          <h2>{category.title}</h2>
          {category.items.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>
      ))}

      <p>Still need help? <Link to="/contact">Contact us</Link></p>
    </div>
  )
}