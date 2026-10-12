import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiMapPin } from 'react-icons/fi'
import AddressFields from '../../components/forms/AddressFields.jsx'
import Input from '../../components/common/Input.jsx'
import Modal from '../../components/common/Modal.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Button from '../../components/common/Button.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import useAuth from '../../hooks/useAuth.js'
import useAsync from '../../hooks/useAsync.js'
import { addAddress, deleteAddress, getAddresses, setDefaultAddress, updateAddress } from '../../services/addressService.js'
import { addressBookSchema } from '../../utils/validation.js'
import '../../styles/account.css'

const blank = { label: '', isDefault: false, address: { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' } }
const toForm = ({ id, label, isDefault, ...address }) => ({ label, isDefault, address })

export default function AddressesPage() {
  const { user } = useAuth()
  const { data: addresses, loading, error, setData } = useAsync(() => getAddresses(user.id), [user.id])
  const [editing, setEditing] = useState(null) // null = closed, 'new' or an address
  const [toDelete, setToDelete] = useState(null)
  const [actionError, setActionError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(addressBookSchema), defaultValues: blank })

  const openForm = (address) => { setActionError(''); reset(address ? toForm(address) : blank); setEditing(address || 'new') }
  const run = async (fn) => { setActionError(''); try { setData(await fn()) } catch (err) { setActionError(err.message || 'Something went wrong.') } }

  const onSubmit = async (values) => {
    const data = { label: values.label, isDefault: values.isDefault, ...values.address }
    await run(() => (editing === 'new' ? addAddress(user.id, data) : updateAddress(user.id, editing.id, data)))
    setEditing(null)
  }

  if (loading) return <Loader label="Loading addresses..." />
  if (error) return <EmptyState title="Could not load addresses" message={error} />

  return (
    <div className="account-page">
      <div className="deal-head"><h1 className="page-title">Address book</h1><Button onClick={() => openForm(null)}>Add address</Button></div>
      {actionError && <p className="auth-error" role="alert">{actionError}</p>}
      {addresses.length === 0 ? (
        <EmptyState icon={<FiMapPin />} title="No saved addresses" message="Add an address to check out faster." action={<Button onClick={() => openForm(null)}>Add address</Button>} />
      ) : (
        <div className="address-grid">
          {addresses.map((a) => (
            <article key={a.id} className={`address-card ${a.isDefault ? 'default' : ''}`}>
              <header><strong>{a.label}</strong>{a.isDefault && <span className="status-badge status-delivered">Default</span>}</header>
              <address>{a.fullName}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />{a.city}, {a.state} {a.pincode}<br />Phone: {a.phone}</address>
              <div className="cart-item-actions">
                <button type="button" onClick={() => openForm(a)}>Edit</button>
                <button type="button" onClick={() => setToDelete(a)}>Delete</button>
                {!a.isDefault && <button type="button" onClick={() => run(() => setDefaultAddress(user.id, a.id))}>Set as default</button>}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add address' : 'Edit address'}>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input label="Label (Home, Work...)" error={errors.label?.message} {...register('label')} />
          <AddressFields register={register} errors={errors} prefix="address" />
          <label className="filter-option"><input type="checkbox" {...register('isDefault')} /> Make this my default address</label>
          <Button type="submit" loading={isSubmitting}>Save address</Button>
        </form>
      </Modal>
      <ConfirmDialog open={!!toDelete} danger title="Delete address?" message={`Delete "${toDelete?.label}"? This cannot be undone.`} confirmLabel="Delete"
        onCancel={() => setToDelete(null)} onConfirm={async () => { await run(() => deleteAddress(user.id, toDelete.id)); setToDelete(null) }} />
    </div>
  )
}
