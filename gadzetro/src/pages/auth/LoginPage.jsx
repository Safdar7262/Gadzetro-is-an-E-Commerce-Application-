import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard.jsx'
import LoginForm from '../../components/auth/LoginForm.jsx'
import useAuth from '../../hooks/useAuth.js'

// Only allow redirects to pages inside this app.
const safePath = (p) => (typeof p === 'string' && p.startsWith('/') && !p.startsWith('//') ? p : null)

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const from = location.state?.from
  const target = safePath(params.get('redirect')) || (from ? safePath(from.pathname + (from.search || '')) : null)
  const home = (u) => target || (u.role === 'admin' ? '/admin/dashboard' : '/account')

  if (isAuthenticated) return <Navigate to={home(user)} replace />

  return (
    <AuthCard title="Welcome back" subtitle="Log in to your Gadzetro account." footer={<>New here? <Link to="/register">Create an account</Link></>}>
      <LoginForm onSuccess={(u) => navigate(home(u), { replace: true })} />
      <details className="demo-box">
        <summary>Demo accounts (frontend only)</summary>
        <p><strong>Customer:</strong> customer@gadzetro.demo / Customer@123</p>
        <p><strong>Admin:</strong> admin@gadzetro.demo / Admin@123</p>
        <p className="muted small">Mock login for testing. Real secure authentication comes with the backend.</p>
      </details>
    </AuthCard>
  )
}
