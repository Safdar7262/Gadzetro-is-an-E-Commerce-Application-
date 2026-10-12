import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiShoppingCart } from 'react-icons/fi'
import AddressFields from '../../components/forms/AddressFields.jsx'
import CartSummary from '../../components/cart/CartSummary.jsx'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import useCart from '../../hooks/useCart.js'
import useAuth from '../../hooks/useAuth.js'
import { createOrder } from '../../services/orderService.js'
import { checkoutSchema } from '../../utils/validation.js'
import { SHIPPING_METHODS } from '../../utils/pricing.js'
import { formatCurrency } from '../../utils/currency.js'
import { storeSettings } from '../../data/storeSettings.js'
import '../../styles/cart.css'

const emptyAddress = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' }
const PAYMENT_OPTIONS = [
  { id: 'cod', label: 'Cash on Delivery', note: 'Pay when your order arrives.' },
  { id: 'upi', label: 'UPI', note: 'Demo only: no UPI ID is collected.' },
  { id: 'card', label: 'Credit / Debit card', note: 'Demo only: no card details are collected.' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, appliedCoupon, getTotals, clearCart } = useCart()
  const { user } = useAuth()
  const [submitError, setSubmitError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: {
      customer: { name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' },
      shipping: emptyAddress,
      sameAsShipping: true,
      billing: emptyAddress,
      shippingMethod: 'standard',
      paymentMethod: 'cod',
    },
  })

  const sameAsShipping = watch('sameAsShipping')
  const shippingMethod = watch('shippingMethod')
  const paymentMethod = watch('paymentMethod')
  const totals = getTotals(shippingMethod)

  if (items.length === 0) {
    return (
      <div className="container page">
        <EmptyState icon={<FiShoppingCart />} title="Your cart is empty" message="Add some products before checking out."
          action={<Button to="/shop">Continue shopping</Button>} />
      </div>
    )
  }

  const onSubmit = async (values) => {
    setSubmitError('')
    try {
      const order = await createOrder({
        userId: user?.id ?? null,
        items: items.map((i) => ({ productId: i.id, qty: i.qty })),
        couponCode: appliedCoupon?.code ?? null,
        shippingMethod: values.shippingMethod,
        paymentMethod: values.paymentMethod,
        customer: values.customer,
        shippingAddress: values.shipping,
        billingAddress: values.sameAsShipping ? values.shipping : values.billing,
      })
      clearCart()
      navigate(`/order-success/${order.id}`, { replace: true })
    } catch (err) {
      setSubmitError(err.message || 'Could not place the order. Please try again.')
    }
  }

  const shippingPrice = (id) => {
    const t = getTotals(id).shipping
    return t === 0 ? 'Free' : formatCurrency(t)
  }

  return (
    <div className="container page">
      <h1 className="page-title">Checkout</h1>
      <p className="deal-note">Demo checkout: no real payment is processed and no payment details are collected.</p>

      <form className="cart-layout checkout" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="checkout-sections">
          <section className="panel">
            <h2>1. Customer information</h2>
            <div className="form-grid">
              <Input label="Full name" error={errors.customer?.name?.message} autoComplete="name" {...register('customer.name')} />
              <Input label="Email" type="email" error={errors.customer?.email?.message} autoComplete="email" {...register('customer.email')} />
              <Input label="Mobile number" error={errors.customer?.phone?.message} inputMode="numeric" maxLength={10} autoComplete="tel" {...register('customer.phone')} />
            </div>
          </section>

          <section className="panel">
            <h2>2. Shipping address</h2>
            <AddressFields register={register} errors={errors} prefix="shipping" />
          </section>

          <section className="panel">
            <h2>3. Billing address</h2>
            <label className="filter-option"><input type="checkbox" {...register('sameAsShipping')} /> Same as shipping address</label>
            {!sameAsShipping && <AddressFields register={register} errors={errors} prefix="billing" />}
          </section>

          <section className="panel">
            <h2>4. Shipping method</h2>
            <div className="option-cards">
              {SHIPPING_METHODS.map((m) => (
                <label key={m.id} className={`option-card ${shippingMethod === m.id ? 'selected' : ''}`}>
                  <input type="radio" value={m.id} {...register('shippingMethod')} />
                  <span><strong>{m.label}</strong><small>{m.days}</small></span>
                  <em>{shippingPrice(m.id)}</em>
                </label>
              ))}
            </div>
            <p className="muted small">Standard delivery is free on orders of {formatCurrency(storeSettings.freeShippingThreshold)} or more.</p>
          </section>

          <section className="panel">
            <h2>5. Payment method</h2>
            <div className="option-cards">
              {PAYMENT_OPTIONS.map((p) => (
                <label key={p.id} className={`option-card ${paymentMethod === p.id ? 'selected' : ''}`}>
                  <input type="radio" value={p.id} {...register('paymentMethod')} />
                  <span><strong>{p.label}</strong><small>{p.note}</small></span>
                </label>
              ))}
            </div>
            {errors.paymentMethod && <p className="ui-field-error" role="alert">{errors.paymentMethod.message}</p>}
          </section>
        </div>

        <aside>
          <CartSummary totals={totals} couponCode={appliedCoupon?.code}>
            <ul className="mini-items">
              {items.map((i) => <li key={i.id}><span>{i.name} × {i.qty}</span><span>{formatCurrency(i.price * i.qty)}</span></li>)}
            </ul>
            {appliedCoupon && !totals.coupon.valid && <p className="cart-warning" role="alert">{totals.coupon.reason}</p>}
            {submitError && <p className="cart-warning" role="alert">{submitError}</p>}
            {Object.keys(errors).length > 0 && <p className="cart-warning" role="alert">Please fix the highlighted fields.</p>}
            <Button type="submit" size="lg" className="full" loading={isSubmitting}>{isSubmitting ? 'Placing order...' : `Place order (demo) · ${formatCurrency(totals.total)}`}</Button>
          </CartSummary>
        </aside>
      </form>
    </div>
  )
}
