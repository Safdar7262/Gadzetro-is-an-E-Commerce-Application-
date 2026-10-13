// SAMPLE FAQ content for demonstration. Replace with your real store answers before launch.
import { storeSettings } from './storeSettings.js'
import { formatCurrency } from '../utils/currency.js'

export const faqCategories = [
  {
    id: 'orders',
    title: 'Orders',
    items: [
      { q: 'How do I place an order?', a: 'Add products to your cart, open the cart, click "Proceed to checkout", enter your details and place the order. In this demo no real payment is taken.' },
      { q: 'Where can I see my orders?', a: 'Log in and open My Account, then My Orders. You can see the status, items and total of every order there.' },
      { q: 'Can I cancel an order?', a: 'Yes, while the order is still in the "Placed" or "Processing" status. Open the order in My Orders and use the Cancel order button.' },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping and delivery',
    items: [
      { q: 'How much does shipping cost?', a: `Standard delivery costs ${formatCurrency(storeSettings.shippingCharge)} and is free on orders of ${formatCurrency(storeSettings.freeShippingThreshold)} or more. Express delivery costs ${formatCurrency(storeSettings.expressShippingCharge)}.` },
      { q: 'How long does delivery take?', a: 'Standard delivery usually takes 3-5 business days and express delivery 1-2 business days. These are estimates, not guarantees.' },
      { q: 'Can I check if you deliver to my PIN code?', a: 'Yes. Use the "Check delivery" box on any product page. In this demo the result is simulated.' },
    ],
  },
  {
    id: 'returns',
    title: 'Returns and refunds',
    items: [
      { q: 'What is your return window?', a: 'Our sample policy allows returns within 7 days of delivery for eligible items. See the Return Policy page for details.' },
      { q: 'How do I start a return?', a: 'Contact our support team with your order number. An automated returns flow is not part of this demo.' },
      { q: 'When will I get my refund?', a: 'In the sample policy, refunds are processed within 5-7 business days after the returned item is checked.' },
    ],
  },
  {
    id: 'payments',
    title: 'Payments and coupons',
    items: [
      { q: 'Which payment methods are available?', a: 'The demo checkout shows Cash on Delivery, UPI and Card as options, but no real payment is processed and no payment details are collected.' },
      { q: 'How do I use a coupon?', a: 'Enter the code in the cart and click Apply. Demo codes are listed under "Demo coupon codes" in the cart. Each code has its own minimum order value.' },
    ],
  },
  {
    id: 'account',
    title: 'Account and security',
    items: [
      { q: 'Do I need an account to shop?', a: 'You can add products to the cart and check out as a guest. An account lets you see your orders, save addresses and write reviews.' },
      { q: 'I forgot my password. What should I do?', a: 'Use the "Forgot password?" link on the login page. In this demo the reset is simulated and no email is sent.' },
    ],
  },
]