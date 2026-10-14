import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiPackage } from 'react-icons/fi'
import AdminHeader from '../../components/admin/AdminHeader.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Loader from '../../components/common/Loader.jsx'
import Button from '../../components/common/Button.jsx'
import useAsync from '../../hooks/useAsync.js'
import { deleteProduct, getAdminBrands, getAdminCategories, getAdminProducts } from '../../services/adminService.js'
import { formatCurrency } from '../../utils/currency.js'
import '../../styles/admin.css'

const PAGE_SIZE = 10
const LOW_STOCK = 10

export default function AdminProductsPage() {
  const { data, loading, error, reload } = useAsync(() => Promise.all([getAdminProducts(), getAdminCategories(), getAdminBrands()]), [])
  const [term, setTerm] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [stock, setStock] = useState('all')
  const [page, setPage] = useState(1)
  const [toDelete, setToDelete] = useState(null)
  const [message, setMessage] = useState(useLocation().state?.message || '')
  const [pageError, setPageError] = useState('')

  if (loading) return <Loader label="Loading products..." />
  if (error) return <EmptyState title="Could not load products" message={error} action={<Button onClick={reload}>Try again</Button>} />
  const [products, categories, brands] = data
  const nameOf = (list, id) => list.find((x) => x.id === id)?.name ?? id

  const t = term.trim().toLowerCase()
  const filtered = products
    .filter((p) => !t || p.name.toLowerCase().includes(t) || String(p.sku).toLowerCase().includes(t))
    .filter((p) => category === 'all' || p.categoryId === category)
    .filter((p) => status === 'all' || p.status === status)
    .filter((p) => stock === 'all' || (stock === 'out' ? p.stock === 0 : p.stock > 0 && p.stock <= LOW_STOCK))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const reset = (setter) => (e) => { setter(e.target.value); setPage(1) }

  const confirmDelete = async () => {
    setPageError(''); setMessage('')
    try { await deleteProduct(toDelete.id); setMessage(`"${toDelete.name}" was deleted.`); reload() } catch (err) { setPageError(err.message || 'Could not delete the product.') }
    setToDelete(null)
  }

  const columns = [
    { key: 'name', label: 'Product', render: (p) => (
      <div className="cell-product">
        <img className="thumb" src={p.images[0]} alt="" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg' }} />
        <div><strong>{p.name}</strong><small>SKU {p.sku}</small></div>
      </div>
    ) },
    { key: 'category', label: 'Category', render: (p) => nameOf(categories, p.categoryId) },
    { key: 'brand', label: 'Brand', render: (p) => nameOf(brands, p.brandId) },
    { key: 'price', label: 'Price', render: (p) => <>{formatCurrency(p.price)}<small className="muted"> / {formatCurrency(p.originalPrice)}</small></> },
    { key: 'stock', label: 'Stock', render: (p) => <span className={`pill ${p.stock === 0 ? 'pill-red' : p.stock <= LOW_STOCK ? 'pill-amber' : 'pill-green'}`}>{p.stock === 0 ? 'Out of stock' : p.stock}</span> },
    { key: 'status', label: 'Status', render: (p) => <span className={`pill ${p.status === 'active' ? 'pill-blue' : 'pill-amber'}`}>{p.status === 'active' ? 'Active' : 'Draft'}</span> },
    { key: 'actions', label: 'Actions', render: (p) => (
      <div className="row-actions">
        <Link to={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`}>Edit</Link>
        <button type="button" className="danger" onClick={() => setToDelete(p)} aria-label={`Delete ${p.name}`}>Delete</button>
      </div>
    ) },
  ]

  return (
    <div>
      <AdminHeader title="Products" subtitle={`${products.length} total`}><Button to="/admin/products/new">Add product</Button></AdminHeader>
      {message && <p className="success-msg" role="status">{message}</p>}
      {pageError && <p className="auth-error" role="alert">{pageError}</p>}

      <div className="toolbar">
        <input type="search" value={term} onChange={reset(setTerm)} placeholder="Search by name or SKU" aria-label="Search products" />
        <select value={category} onChange={reset(setCategory)} aria-label="Category">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={status} onChange={reset(setStatus)} aria-label="Status">
          <option value="all">All statuses</option><option value="active">Active</option><option value="draft">Draft</option>
        </select>
        <select value={stock} onChange={reset(setStock)} aria-label="Stock level">
          <option value="all">Any stock</option><option value="low">Low stock (10 or fewer)</option><option value="out">Out of stock</option>
        </select>
      </div>

      <DataTable columns={columns} rows={rows} rowKey={(p) => p.id}
        empty={<EmptyState icon={<FiPackage />} title="No products found" message="Try different search words or filters." />} />
      <div className="table-pager"><Pagination page={current} totalPages={totalPages} onChange={setPage} /></div>

      <ConfirmDialog open={!!toDelete} danger title="Delete product?" message={`Delete "${toDelete?.name}"? It will disappear from the shop. This cannot be undone.`}
        confirmLabel="Delete" onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
    </div>
  )
}