import Input from '../common/Input.jsx'

// Reusable address fields for React Hook Form. prefix is the form key, e.g. "shipping" or "billing".
export default function AddressFields({ register, errors, prefix }) {
  const err = (name) => errors?.[prefix]?.[name]?.message
  const field = (name, label, props = {}) => (
    <Input label={label} error={err(name)} {...register(`${prefix}.${name}`)} {...props} />
  )
  return (
    <div className="form-grid">
      {field('fullName', 'Full name', { autoComplete: 'name' })}
      {field('phone', 'Mobile number', { inputMode: 'numeric', maxLength: 10, autoComplete: 'tel' })}
      {field('line1', 'Address line 1', { autoComplete: 'address-line1', className: 'span-2' })}
      {field('line2', 'Address line 2 (optional)', { autoComplete: 'address-line2', className: 'span-2' })}
      {field('city', 'City', { autoComplete: 'address-level2' })}
      {field('state', 'State', { autoComplete: 'address-level1' })}
      {field('pincode', 'PIN code', { inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' })}
    </div>
  )
}
