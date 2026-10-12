import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'

// FRONTEND-ONLY guard for a nicer experience. It is not security: the backend must check roles too.
export default function ProtectedRoute({ role, loginPath = '/login', children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to={loginPath} replace state={{ from: location }} />
  if (role && user.role !== role) return <Navigate to="/access-denied" replace />
  return children
}
