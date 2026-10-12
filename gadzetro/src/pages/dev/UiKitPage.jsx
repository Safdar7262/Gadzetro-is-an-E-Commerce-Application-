import { useState } from 'react'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import Modal from '../../components/common/Modal.jsx'
import Loader from '../../components/common/Loader.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Rating from '../../components/common/Rating.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatCurrency } from '../../utils/currency.js'

// Developer-only page to test the shared components. Safe to delete before launch (also remove its route).
export default function UiKitPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [email, setEmail] = useState('')
  const [result, setResult] = useState('')

  return (
    <div className="container page ui-kit">
      <h1 className="page-title">UI Kit (dev only)</h1>

      <h3>Buttons</h3>
      <div className="row">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button size="sm">Small</Button>
      </div>

      <h3>Input</h3>
      <div className="row">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} hint="We never share your email." />
        <Input label="With error" defaultValue="oops" error="This field is required." />
      </div>

      <h3>Rating and currency</h3>
      <div className="row"><Rating value={4.5} count={1204} /><Rating value={3} count={12} /><strong>{formatCurrency(1234567)}</strong></div>

      <h3>Pagination (page {page})</h3>
      <Pagination page={page} totalPages={12} onChange={setPage} />

      <h3>Modal, confirm dialog, loader, empty state</h3>
      <div className="row">
        <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete something</Button>
        {result && <span>{result}</span>}
      </div>
      <Loader label="Loading products..." />
      <EmptyState title="Nothing here yet" message="Use this component for empty lists and no-result screens." action={<Button to="/shop">Browse shop</Button>} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Sample modal" footer={<Button onClick={() => setModalOpen(false)}>Close</Button>}>
        <p>Press Esc or click outside to close.</p>
      </Modal>
      <ConfirmDialog open={confirmOpen} danger title="Delete item?" message="This cannot be undone." confirmLabel="Delete"
        onConfirm={() => { setConfirmOpen(false); setResult('Deleted (demo)') }} onCancel={() => setConfirmOpen(false)} />
    </div>
  )
}
