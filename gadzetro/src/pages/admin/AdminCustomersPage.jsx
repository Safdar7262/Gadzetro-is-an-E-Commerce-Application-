import { useState } from 'react'
import { FiUsers } from 'react-icons/fi'
import AdminHeader from '../../components/admin/AdminHeader.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import Modal from '../../components/common/Modal.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx'
import useAsync from '../../hooks/useAsync.js'
import { deleteCustomer, getAdminCustomers, setCustomerBlocked } from '../../services/adminService.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDate } from '../../utils/formatDate.js'
import '../../styles/admin.css'

export default function AdminCustomersPage() {
  const { data: customers, loading, error, reload } = useAsync(getAdminCustomers, [])
  const [term, setTerm] = useState('')
  const [status, setStatus] = useState('all')
  const [viewing, setViewing] = useState(null)
  const [confirm, setConfirm] = useState(null) // { type: 'block' | 'unblock' | 'delete', customer }
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')

  if (loading) return <Loader label="Loading customers..." />
  if (error) return <EmptyState title="Could not load customers" message={error} action={<Button onClick={reload}>Try again</Button>} />

  const t = term.trim().toLowerCase()
  const rows = customers
    .filter((c) => !t || c.name.toLowerCase().includes(t) || c.email.toLowerCase().includes(t) || c.phone.includes(t))
    .filter((c) => status === 'all' || (status === 'blocked' ? c.blocked : !c.blocked))

  const run = async () => {
    const { type, customer } = confirm
    setActionError(''); setMessage('')
    try {
      if (type === 'delete') { await deleteCustomer(customer.id); setMessage(`${customer.name} was deleted.`) }
      else { await setCustomerBlocked(customer.id, type === 'block'); setMessage(`${customer.name} was ${type === 'block' ? 'blocked' : 'unblocked'}.`) }
      reload()
    } catch (err) { setActionError(err.message || 'Action failed.') }
    setConfirm(null)
  }
  const copy = {
    block: ['Block this customer?', 'They will not be able to log in until you unblock them.', 'Block'],
    unblock: ['Unblock this customer?', 'They will be able to log in again.', 'Unblock'],
    delete: ['Delete this customer?', 'The account will be removed. Their past orders stay in the order list. This cannot be undone.', 'Delete'],
  }

  const columns = [
    { key: 'name', label: 'Customer', render: (c) => <div><strong>{c.name}</strong><small className="muted block">{c.email}</small></div> },
    { key: 'phone', label: 'Phone' },
    { key: 'joined', label: 'Joined', render: (c) => formatDate(c.createdAt) },
    { key: 'orders', label: 'Orders', render: (c) => c.orderCount },
    { key: 'spent', label: 'Total spent', render: (c) => formatCurrency(c.totalSpent) },
    { key: 'status', label: 'Status', render: (c) => <span className={`pill ${c.blocked ? 'pill-red' : 'pill-green'}`}>{c.blocked ? 'Blocked' : 'Active'}</span> },
    { key: 'actions', label: 'Actions', render: (c) => (
      <div className="row-actions">
        <button type="button" onClick={() => setViewing(c)} aria-label={`View ${c.name}`}>View</button>
        <button type="button" onClick={() => setConfirm({ type: c.blocked ? 'unblock' : 'block', customer: c })} aria-label={`${c.blocked ? 'Unblock' : 'Block'} ${c.name}`}>{c.blocked ? 'Unblock' : 'Block'}</button>
        <button type="button" className="danger" onClick={() => setConfirm({ type: 'delete', customer: c })} aria-label={`Delete ${c.name}`}>Delete</button>
      </div>
    ) },
  ]

  return (
    <div>
      <AdminHeader title="Customers" subtitle={`${customers.length} total`} />
      {message && <p className="success-msg" role="status">{message}</p>}
      {actionError && <p className="auth-error" role="alert">{actionError}</p>}
      <div className="toolbar">
        <input type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search by name, email or phone" aria-label="Search customers" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Customer status">
          <option value="all">All customers</option><option value="active">Active</option><option value="blocked">Blocked</option>
        </select>
      </div>
      <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} empty={<EmptyState icon={<FiUsers />} title="No customers found" message="Try a different search or filter." />} />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name || 'Customer'}>
        {viewing && (
          <div className="customer-detail">
            <p>{viewing.email}<br />{viewing.phone}<br /><span className="muted small">Joined {formatDate(viewing.createdAt)} · Account ID {viewing.id}</span></p>
            <p><strong>{viewing.orderCount}</strong> orders · <strong>{formatCurrency(viewing.totalSpent)}</strong> spent</p>
            <h3>Recent orders</h3>
            {viewing.recentOrders.length === 0 ? <p className="muted">No orders yet.</p> : (
              <ul className="order-list">
                {viewing.recentOrders.map((o) => <li key={o.id}><strong>{o.id}</strong><span>{formatDate(o.createdAt)}</span><span>{formatCurrency(o.total)}</span><OrderStatusBadge status={o.status} /></li>)}
              </ul>
            )}
          </div>
        )}
      </Modal>
      <ConfirmDialog open={!!confirm} danger={confirm?.type !== 'unblock'} title={confirm ? copy[confirm.type][0] : ''}
        message={confirm ? `${confirm.customer.name}: ${copy[confirm.type][1]}` : ''} confirmLabel={confirm ? copy[confirm.type][2] : 'Confirm'}
        onCancel={() => setConfirm(null)} onConfirm={run} />
    </div>
  )
}