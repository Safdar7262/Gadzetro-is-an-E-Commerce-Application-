import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AdminHeader from '../../components/admin/AdminHeader.jsx'
import ImagePicker from '../../components/admin/ImagePicker.jsx'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import useAsync from '../../hooks/useAsync.js'
import { createProduct, getAdminBrands, getAdminCategories, getAdminProductById, updateProduct } from '../../services/adminService.js'
import { productSchema } from '../../utils/validation.js'
import { formatCurrency } from '../../utils/currency.js'
import '../../styles/account.css'
import '../../styles/admin.css'

const blank = {
  name: '', sku: '', description: '', categoryId: '', brandId: '', mrp: '', discount: 0, stock: 0, status: 'active',
  image: '', highlights: '', specs: '', isFeatured: false, isBestSeller: false, isNewArrival: false,
}
const toFormValues = (p) => ({
  name: p.name, sku: p.sku || '', description: p.description, categoryId: p.categoryId, brandId: p.brandId,
  mrp: p.originalPrice, discount: p.originalPrice > 0 ? Math.round((1 - p.price / p.originalPrice) * 100) : 0,
  stock: p.stock, status: p.status, image: p.images[0],
  highlights: (p.highlights || []).join('\n'),
  specs: Object.entries(p.specifications || {}).map(([k, v]) => `${k}: ${v}`).join('\n'),
  isFeatured: !!p.isFeatured, isBestSeller: !!p.isBestSeller, isNewArrival: !!p.isNewArrival,
})

export default function AdminProductFormPage() {
  const { productId } = useParams()
  const isEdit = Boolean(productId)
  const navigate = useNavigate()
  const { data, loading, error } = useAsync(
    () => Promise.all([getAdminCategories(), getAdminBrands(), isEdit ? getAdminProductById(productId) : Promise.resolve(null)]),
    [productId]
  )
  const [submitError, setSubmitError] = useState('')
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(productSchema), defaultValues: blank })

  useEffect(() => { if (data?.[2]) reset(toFormValues(data[2])) }, [data, reset])

  if (loading) return <Loader label="Loading..." />
  if (error) return <EmptyState title={isEdit ? 'Product not found' : 'Could not load the form'} message={error} action={<Button to="/admin/products">Back to products</Button>} />
  const [categories, brands] = data

  const mrp = Number(watch('mrp')) || 0
  const discount = Number(watch('discount')) || 0
  const price = Math.round((mrp * (100 - Math.min(Math.max(discount, 0), 90))) / 100)

  const onSubmit = async (values) => {
    setSubmitError('')
    try {
      const saved = isEdit ? await updateProduct(productId, values) : await createProduct(values)
      navigate('/admin/products', { state: { message: `"${saved.name}" was ${isEdit ? 'updated' : 'created'}.` } })
    } catch (err) { setSubmitError(err.message || 'Could not save the product.') }
  }

  const select = (name, label, options, placeholder) => (
    <div className="ui-field">
      <label htmlFor={`p-${name}`}>{label}</label>
      <select id={`p-${name}`} aria-invalid={errors[name] ? true : undefined} {...register(name)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {errors[name] && <p className="ui-field-error" role="alert">{errors[name].message}</p>}
    </div>
  )

  return (
    <div>
      <AdminHeader title={isEdit ? 'Edit product' : 'Add product'}><Button to="/admin/products" variant="outline">Back to products</Button></AdminHeader>
      {submitError && <p className="auth-error" role="alert">{submitError}</p>}
      <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="panel">
          <h2>Basic details</h2>
          <div className="form-grid">
            <Input label="Product name" className="span-2" error={errors.name?.message} {...register('name')} />
            <Input label="SKU" error={errors.sku?.message} {...register('sku')} />
            {select('status', 'Status', [{ value: 'active', label: 'Active (visible in shop)' }, { value: 'draft', label: 'Draft (hidden)' }])}
            {select('categoryId', 'Category', categories.map((c) => ({ value: c.id, label: c.name })), 'Select a category')}
            {select('brandId', 'Brand', brands.map((b) => ({ value: b.id, label: b.name })), 'Select a brand')}
            <div className="ui-field span-2">
              <label htmlFor="p-description">Description</label>
              <textarea id="p-description" rows={4} aria-invalid={errors.description ? true : undefined} {...register('description')} />
              {errors.description && <p className="ui-field-error" role="alert">{errors.description.message}</p>}
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Price and stock</h2>
          <div className="form-grid">
            <Input label="Price / MRP (₹)" type="number" min="0" error={errors.mrp?.message} {...register('mrp')} />
            <Input label="Discount (%)" type="number" min="0" max="90" error={errors.discount?.message} {...register('discount')} />
            <Input label="Stock quantity" type="number" min="0" error={errors.stock?.message} {...register('stock')} />
            <p className="price-preview">Selling price: {formatCurrency(price)}</p>
          </div>
        </section>

        <section className="panel">
          <h2>Image</h2>
          <ImagePicker value={watch('image')} onChange={(v) => setValue('image', v, { shouldValidate: true, shouldDirty: true })} error={errors.image?.message} />
        </section>

        <section className="panel">
          <h2>Extra details (optional)</h2>
          <div className="ui-field">
            <label htmlFor="p-highlights">Highlights (one per line)</label>
            <textarea id="p-highlights" rows={3} {...register('highlights')} />
          </div>
          <div className="ui-field">
            <label htmlFor="p-specs">Specifications (one per line, like "Battery: 5000 mAh")</label>
            <textarea id="p-specs" rows={4} {...register('specs')} />
          </div>
          <div className="check-row">
            <label className="filter-option"><input type="checkbox" {...register('isFeatured')} /> Featured</label>
            <label className="filter-option"><input type="checkbox" {...register('isBestSeller')} /> Best seller</label>
            <label className="filter-option"><input type="checkbox" {...register('isNewArrival')} /> New arrival</label>
          </div>
        </section>

        <div className="coming-soon-actions">
          <Button type="submit" size="lg" loading={isSubmitting}>{isEdit ? 'Save changes' : 'Create product'}</Button>
          <Button to="/admin/products" variant="outline" size="lg">Cancel</Button>
        </div>
      </form>
    </div>
  )
}