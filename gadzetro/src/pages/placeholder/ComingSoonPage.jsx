import { useLocation, useParams } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'

// Temporary page for routes that are built in later phases. It proves the route and its URL params work.
export default function ComingSoonPage({ title, phase }) {
  const params = useParams()
  const { pathname, search } = useLocation()
  const entries = Object.entries(params)
  return (
    <div className="container page coming-soon">
      <h1 className="page-title">{title}</h1>
      <p>This page is planned for <strong>Phase {phase}</strong>. The route is working.</p>
      <p className="muted">URL: <code>{pathname}{search}</code></p>
      {entries.length > 0 && (
        <ul className="param-list">
          {entries.map(([key, value]) => <li key={key}><code>{key}</code> = <code>{value}</code></li>)}
        </ul>
      )}
      <div className="coming-soon-actions">
        <Button to="/">Go to homepage</Button>
        <Button to="/shop" variant="outline">Browse shop</Button>
      </div>
    </div>
  )
}
