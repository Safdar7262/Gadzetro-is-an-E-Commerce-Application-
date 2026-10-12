import { formatCurrency } from '../../utils/currency.js'
import { storeSettings } from '../../data/storeSettings.js'

// Price breakdown used on both the cart and checkout pages. "children" renders below (buttons, notes).
export default function CartSummary({ totals, couponCode, children }) {
  return (
    <section className="summary" aria-label="Order summary">
      <h2>Order summary</h2>
      <dl>
        <div><dt>Subtotal ({totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'})</dt><dd>{formatCurrency(totals.subtotal)}</dd></div>
        {totals.discount > 0 && <div className="discount"><dt>Discount{couponCode ? ` (${couponCode})` : ''}</dt><dd>−{formatCurrency(totals.discount)}</dd></div>}
        <div><dt>Shipping (estimated)</dt><dd>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</dd></div>
        <div><dt>Estimated tax ({Math.round(storeSettings.taxRate * 100)}% GST, demo)</dt><dd>{formatCurrency(totals.tax)}</dd></div>
        <div className="total"><dt>Total</dt><dd>{formatCurrency(totals.total)}</dd></div>
      </dl>
      {totals.freeShippingGap > 0 && !totals.coupon.freeShipping && (
        <p className="muted small">Add {formatCurrency(totals.freeShippingGap)} more for free standard shipping.</p>
      )}
      {children}
    </section>
  )
}
