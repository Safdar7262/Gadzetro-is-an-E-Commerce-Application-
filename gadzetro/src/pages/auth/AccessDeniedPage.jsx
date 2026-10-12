import { useNavigate } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'
import useAuth from '../../hooks/useAuth.js'

export default function AccessDeniedPage() {
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="container page">
      <EmptyState icon={<FiLock />} title="Access denied" message="You do not have permission to open that page. If you think this is a mistake, try logging in with a different account."
        action={
          <div className="coming-soon-actions">
            <Button to="/">Go to homepage</Button>
            {isAuthenticated && <Button variant="outline" onClick={() => { logout(); navigate('/login') }}>Log in as someone else</Button>}
          </div>
        } />
    </div>
  )
}
