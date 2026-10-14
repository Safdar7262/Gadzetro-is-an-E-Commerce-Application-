import CrudManager from '../../components/admin/CrudManager.jsx'
import { createCoupon, deleteCoupon, getAdminCoupons, updateCoupon } from '../../services/adminService.js'
import { couponSchema } from '../../utils/validation.js'
import { formatCurrency } from '../../utils/currency.js'

const TYPE_LABEL = { percent: 'Percent off', flat: 'Flat amount off', freeShipping: 'Free shipping' }
const valueText = (c) => (c.type === 'percent' ? `${c.value}%${c.maxDiscount ? ` (max ${formatCurrency(c.maxDiscount)})` : ''}` : c.type === 'flat' ? formatCurrency(c.value) : '-')

export default function AdminCouponsPage() {
  return (
    <CrudManager
      title="Coupons" singular="Coupon"
      load={getAdminCoupons} onCreate={createCoupon} onUpdate={updateCoupon} onDelete={deleteCoupon}
      getId={(row) => row.code} searchKeys={['code', 'description']} schema={couponSchema}
      defaults={{ code: '', type: 'percent', value: 10, maxDiscount: 0, minSubtotal: 0, description: '', active: true }}
      toForm={(row) => ({ code: row.code, type: row.type, value: row.value, maxDiscount: row.maxDiscount || 0, minSubtotal: row.minSubtotal, description: row.description, active: row.active !== false })}
      filter={{ label: 'Status', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }], predicate: (row, v) => (v === 'active' ? row.active !== false : row.active === false) }}
      columns={[
        { key: 'code', label: 'Code', render: (r) => <strong>{r.code}</strong> },
        { key: 'type', label: 'Type', render: (r) => TYPE_LABEL[r.type] },
        { key: 'value', label: 'Value', render: valueText },
        { key: 'minSubtotal', label: 'Min order', render: (r) => formatCurrency(r.minSubtotal) },
        { key: 'status', label: 'Status', render: (r) => <span className={`pill ${r.active === false ? 'pill-red' : 'pill-green'}`}>{r.active === false ? 'Inactive' : 'Active'}</span> },
      ]}
      fields={[
        { name: 'code', label: 'Coupon code', hint: 'Letters and numbers only, for example SAVE20' },
        { name: 'type', label: 'Type', type: 'select', options: [{ value: 'percent', label: 'Percent off' }, { value: 'flat', label: 'Flat amount off' }, { value: 'freeShipping', label: 'Free shipping' }] },
        { name: 'value', label: 'Value (percent or rupees)', type: 'number', hint: 'Ignored for free shipping' },
        { name: 'maxDiscount', label: 'Max discount in rupees (percent coupons, 0 = no limit)', type: 'number' },
        { name: 'minSubtotal', label: 'Minimum order value (rupees)', type: 'number' },
        { name: 'description', label: 'Description' },
        { name: 'active', label: 'Active (customers can use it)', type: 'checkbox' },
      ]}
    />
  )
}