import { getStoredUsers } from '../../services/authService.js'
import { formatDate } from '../../utils/formatDate.js'

export default function AdminCustomersPage() {
  const customers = getStoredUsers().filter((u) => u.role === 'customer')
  return (
    <div className="admin-page">
      <h1 className="admin-title">Customers ({customers.length})</h1>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead>
          <tbody>
            {customers.map((u) => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td><td>{formatDate(u.createdAt)}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}