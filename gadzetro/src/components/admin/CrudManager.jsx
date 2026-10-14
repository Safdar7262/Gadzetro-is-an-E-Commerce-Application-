import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AdminHeader from './AdminHeader.jsx'
import DataTable from './DataTable.jsx'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import ConfirmDialog from '../common/ConfirmDialog.jsx'
import Loader from '../common/Loader.jsx'
import EmptyState from '../common/EmptyState.jsx'
import useAsync from '../../hooks/useAsync.js'
import '../../styles/account.css'
import '../../styles/admin.css'

// A configurable list + add/edit modal + delete confirmation, used for Categories, Brands and Coupons.
// fields: [{ name, label, type: text|number|color|textarea|select|checkbox, options?, hint? }]
export default function CrudManager({
  title, singular, load, onCreate, onUpdate, onDelete, columns, fields, schema, defaults,
  getId, toForm = (row) => row, searchKeys = [], filter,
}) {
  const { data, loading, error, reload } = useAsync(load, [])
  const [term, setTerm] = useState('')
  const [filterValue, setFilterValue] = useState('all')
  const [editing, setEditing] = useState(null) // null | 'new' | row
  const [toDelete, setToDelete] = useState(null)
  const [message, setMessage] = useState('')
  const [pageError, setPageError] = useState('')
  const [modalError, setModalError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: defaults })

  const open = (row) => { setModalError(''); setMessage(''); reset(row ? toForm(row) : defaults); setEditing(row || 'new') }

  const onSubmit = async (values) => {
    setModalError('')
    try {
      if (editing === 'new') await onCreate(values)
      else await onUpdate(getId(editing), values)
      setEditing(null)
      setMessage(`${singular} saved.`)
      reload()
    } catch (err) { setModalError(err.message || 'Could not save.') }
  }

  const confirmDelete = async () => {
    setPageError(''); setMessage('')
    try { await onDelete(getId(toDelete)); setMessage(`${singular} deleted.`); reload() } catch (err) { setPageError(err.message || 'Could not delete.') }
    setToDelete(null)
  }

  const renderField = (f) => {
    const err = errors[f.name]?.message
    if (f.type === 'textarea') {
      return (
        <div key={f.name} className="ui-field">
          <label htmlFor={`f-${f.name}`}>{f.label}</label>
          <textarea id={`f-${f.name}`} rows={3} aria-invalid={err ? true : undefined} {...register(f.name)} />
          {err && <p className="ui-field-error" role="alert">{err}</p>}
        </div>
      )
    }
    if (f.type === 'select') {
      return (
        <div key={f.name} className="ui-field">
          <label htmlFor={`f-${f.name}`}>{f.label}</label>
          <select id={`f-${f.name}`} {...register(f.name)}>{f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
          {err && <p className="ui-field-error" role="alert">{err}</p>}
        </div>
      )
    }
    if (f.type === 'checkbox') {
      return <label key={f.name} className="filter-option"><input type="checkbox" {...register(f.name)} /> {f.label}</label>
    }
    return <Input key={f.name} label={f.label} type={f.type || 'text'} hint={f.hint} error={err} {...register(f.name)} />
  }

  if (loading) return <Loader label={`Loading ${title.toLowerCase()}...`} />
  if (error) return <EmptyState title={`Could not load ${title.toLowerCase()}`} message={error} action={<Button onClick={reload}>Try again</Button>} />

  const t = term.trim().toLowerCase()
  const rows = data
    .filter((row) => !t || searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(t)))
    .filter((row) => !filter || filterValue === 'all' || filter.predicate(row, filterValue))

  const tableColumns = [
    ...columns,
    { key: 'actions', label: 'Actions', render: (row) => (
      <div className="row-actions">
        <button type="button" onClick={() => open(row)} aria-label={`Edit ${row.name || row.code}`}>Edit</button>
        <button type="button" className="danger" onClick={() => setToDelete(row)} aria-label={`Delete ${row.name || row.code}`}>Delete</button>
      </div>
    ) },
  ]

  return (
    <div>
      <AdminHeader title={title} subtitle={`${data.length} total`}>
        <Button onClick={() => open(null)}>Add {singular.toLowerCase()}</Button>
      </AdminHeader>
      {message && <p className="success-msg" role="status">{message}</p>}
      {pageError && <p className="auth-error" role="alert">{pageError}</p>}

      <div className="toolbar">
        <input type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={`Search ${title.toLowerCase()}`} aria-label={`Search ${title.toLowerCase()}`} />
        {filter && (
          <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)} aria-label={filter.label}>
            <option value="all">All {filter.label.toLowerCase()}</option>
            {filter.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
      </div>

      <DataTable columns={tableColumns} rows={rows} rowKey={getId}
        empty={<EmptyState title={`No ${title.toLowerCase()} found`} message={t || filterValue !== 'all' ? 'Try a different search or filter.' : `Add your first ${singular.toLowerCase()}.`} />} />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? `Add ${singular.toLowerCase()}` : `Edit ${singular.toLowerCase()}`}>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {modalError && <p className="auth-error" role="alert">{modalError}</p>}
          {fields.map(renderField)}
          <Button type="submit" loading={isSubmitting}>Save {singular.toLowerCase()}</Button>
        </form>
      </Modal>
      <ConfirmDialog open={!!toDelete} danger title={`Delete ${singular.toLowerCase()}?`}
        message={`Delete "${toDelete?.name || toDelete?.code}"? This cannot be undone.`} confirmLabel="Delete" onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
    </div>
  )
}