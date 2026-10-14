import '../../styles/admin.css'

export default function AdminHeader({ title, subtitle, children }) {
  return (
    <header className="admin-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {children && <div className="admin-header-actions">{children}</div>}
    </header>
  )
}