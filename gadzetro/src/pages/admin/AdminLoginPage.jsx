import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard.jsx'
import LoginForm from '../../components/auth/LoginForm.jsx'
import useAuth from '../../hooks/useAuth.js'

export default function AdminLoginPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from?.pathname
  const target = from?.startsWith('/admin') ? from : '/admin/dashboard'
  if (isAdmin) return <Navigate to={target} replace />
  return (
    <AuthCard title="Admin login" subtitle="Demo admin area. Not secure: real role-based access arrives with the backend.">
      <LoginForm adminMode onSuccess={() => navigate(target, { replace: true })} />
      <details className="demo-box">
        <summary>Demo admin account</summary>
        <p>admin@gadzetro.demo / Admin@123</p>
      </details>
    </AuthCard>
  )
}
