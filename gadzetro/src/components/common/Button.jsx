import { Link } from 'react-router-dom'

// variant: primary | outline | ghost | danger   size: sm | md | lg   Pass "to" to render a router link.
export default function Button({ variant = 'primary', size = 'md', loading = false, disabled = false, to, className = '', type = 'button', children, ...rest }) {
  const classes = `ui-btn ui-btn-${variant} ui-btn-${size} ${className}`.trim()
  if (to) return <Link to={to} className={classes} {...rest}>{children}</Link>
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <span className="ui-spinner small" aria-hidden="true" />}
      {children}
    </button>
  )
}
