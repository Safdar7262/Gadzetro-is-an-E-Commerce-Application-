import '../../styles/account.css'

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  )
}
