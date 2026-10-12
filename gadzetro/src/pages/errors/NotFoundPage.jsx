import { FiAlertCircle } from 'react-icons/fi'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'

export default function NotFoundPage() {
  return (
    <div className="container page">
      <EmptyState
        icon={<FiAlertCircle />}
        title="Page not found"
        message="The page you are looking for does not exist or may have moved."
        action={<Button to="/">Back to homepage</Button>}
      />
    </div>
  )
}
