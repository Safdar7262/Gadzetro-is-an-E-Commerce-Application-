import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AdminHeader from '../../components/admin/AdminHeader.jsx'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import useAsync from '../../hooks/useAsync.js'
import { getAdminSettings, resetDemoData, saveAdminSettings } from '../../services/adminService.js'
import { settingsSchema } from '../../utils/validation.js'
import '../../styles/account.css'
import '../../styles/admin.css'

const MAX_LOGO_BYTES = 300 * 1024

export default function AdminSettingsPage() {
  const { data, loading, error } = useAsync(getAdminSettings, [])
  const [message, setMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [logoError, setLogoError] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: { storeName: '', contactEmail: '', logo: '', shippingCharge: 0, expressShippingCharge: 0, freeShippingThreshold: 0, taxPercent: 0 },
  })

  useEffect(() => {
    if (data) reset({
      storeName: data.storeName, contactEmail: data.contactEmail, logo: data.logo,
      shippingCharge: data.shippingCharge, expressShippingCharge: data.expressShippingCharge,
      freeShippingThreshold: data.freeShippingThreshold, taxPercent: Math.round(data.taxRate * 10000) / 100,
    })
  }, [data, reset])

  if (loading) return <Loader label="Loading settings..." />
  if (error) return <EmptyState title="Could not load settings" message={error} />

  const onSubmit = async (values) => {
    setSubmitError(''); setMessage('')
    try { await saveAdminSettings(values); setMessage('Settings saved. Prices and the store header now use them.') } catch (err) { setSubmitError(err.message || 'Could not save the settings.') }
  }
  const onLogoFile = (e) => {
    const file = e.target.files?.[0]
    setLogoError('')
    if (!file) return
    if (!file.type.startsWith('image/')) return setLogoError('Please choose an image file.')
    if (file.size > MAX_LOGO_BYTES) return setLogoError('Logo is too large. Use a file under 300 KB.')
    const reader = new FileReader()
    reader.onload = () => setValue('logo', reader.result, { shouldValidate: true, shouldDirty: true })
    reader.readAsDataURL(file)
  }
  const doReset = async () => { await resetDemoData(); window.location.reload() }
  const logo = watch('logo')

  return (
    <div>
      <AdminHeader title="Settings" subtitle="Demo store settings" />
      {message && <p className="success-msg" role="status">{message}</p>}
      {submitError && <p className="auth-error" role="alert">{submitError}</p>}
      <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="panel">
          <h2>Store</h2>
          <div className="form-grid">
            <Input label="Store name" error={errors.storeName?.message} {...register('storeName')} />
            <Input label="Contact email" type="email" error={errors.contactEmail?.message} {...register('contactEmail')} />
            <Input label="Currency" value="INR (₹)" readOnly hint="Only INR is supported in this demo." />
          </div>
          <div className="image-picker">
            <div className="image-preview"><img src={logo} alt="Logo preview" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg' }} /></div>
            <div>
              <Input label="Logo path" error={errors.logo?.message} hint="Example: /images/logo/logo.png" {...register('logo')} />
              <div className="ui-field">
                <label htmlFor="logo-upload">Or upload a logo (max 300 KB)</label>
                <input id="logo-upload" type="file" accept="image/*" onChange={onLogoFile} />
                {logoError && <p className="ui-field-error" role="alert">{logoError}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Shipping and tax</h2>
          <div className="form-grid">
            <Input label="Standard shipping charge (₹)" type="number" min="0" error={errors.shippingCharge?.message} {...register('shippingCharge')} />
            <Input label="Express shipping charge (₹)" type="number" min="0" error={errors.expressShippingCharge?.message} {...register('expressShippingCharge')} />
            <Input label="Free standard shipping from (₹)" type="number" min="0" error={errors.freeShippingThreshold?.message} {...register('freeShippingThreshold')} />
            <Input label="Tax rate (%)" type="number" min="0" step="0.5" error={errors.taxPercent?.message} {...register('taxPercent')} />
          </div>
        </section>

        <div className="coming-soon-actions">
          <Button type="submit" size="lg" loading={isSubmitting}>Save settings</Button>
        </div>
      </form>

      <section className="panel danger-zone">
        <h2>Reset demo data</h2>
        <p className="muted">Removes your admin changes to products, categories, brands, coupons and settings, and restores the original demo data. Orders, customers and reviews are not touched.</p>
        <Button variant="danger" onClick={() => setConfirmReset(true)}>Reset demo data</Button>
      </section>
      <ConfirmDialog open={confirmReset} danger title="Reset demo data?" message="Your product, category, brand, coupon and settings changes will be removed and the page will reload."
        confirmLabel="Reset" onCancel={() => setConfirmReset(false)} onConfirm={doReset} />
    </div>
  )
}