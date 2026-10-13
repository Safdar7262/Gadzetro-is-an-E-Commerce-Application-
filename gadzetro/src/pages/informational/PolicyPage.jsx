import { policies } from '../../data/policies.js'
import '../../styles/info.css'

// One page component for Shipping, Return, Privacy and Terms: pass policyKey="shipping" | "returns" | "privacy" | "terms".
export default function PolicyPage({ policyKey }) {
  const policy = policies[policyKey]
  return (
    <div className="container page info policy">
      <h1 className="page-title">{policy.title}</h1>
      <p className="policy-notice" role="note">
        <strong>{policy.updated}.</strong> This is placeholder text for a demo store. It has not been reviewed by a business owner or a legal professional and must be reviewed before launch.
      </p>
      {policy.sections.map((section, index) => (
        <section key={section.heading} className="info-section">
          <h2>{index + 1}. {section.heading}</h2>
          {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
          {section.bullets && <ul className="policy-list">{section.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
        </section>
      ))}
    </div>
  )
}