// SAMPLE policy text for demonstration only. It must be reviewed by the business owner and a legal
// professional before launch. Shipping numbers come from storeSettings so they stay consistent.
import { storeSettings } from './storeSettings.js'
import { formatCurrency } from '../utils/currency.js'

export const policies = {
  shipping: {
    title: 'Shipping Policy',
    updated: 'Sample document',
    sections: [
      { heading: 'Order processing', paragraphs: ['Orders are usually packed and handed to the courier within 1-2 business days after they are placed. Orders placed on weekends or holidays are processed on the next business day.'] },
      { heading: 'Delivery options and charges', bullets: [
        `Standard delivery: 3-5 business days, ${formatCurrency(storeSettings.shippingCharge)} (free on orders of ${formatCurrency(storeSettings.freeShippingThreshold)} or more).`,
        `Express delivery: 1-2 business days, ${formatCurrency(storeSettings.expressShippingCharge)}.`,
        'Delivery times are estimates and can change because of weather, courier delays or high demand.',
      ] },
      { heading: 'Delivery area', paragraphs: ['We deliver to PIN codes served by our courier partners. You can check a PIN code on the product page before ordering.'] },
      { heading: 'Tracking', paragraphs: ['Once an order is shipped, its status is updated in My Account, My Orders.'] },
      { heading: 'Wrong or incomplete address', paragraphs: ['Please check your address before placing the order. If a package cannot be delivered because of a wrong or incomplete address, extra shipping charges may apply for re-delivery.'] },
    ],
  },
  returns: {
    title: 'Return Policy',
    updated: 'Sample document',
    sections: [
      { heading: 'Return window', paragraphs: ['You can request a return within 7 days of delivery for eligible products.'] },
      { heading: 'Eligible items', bullets: ['The product is unused and in its original condition.', 'Original packaging, accessories and invoice are included.', 'The product has a manufacturing defect, is damaged in transit, or is not what you ordered.'] },
      { heading: 'Items that cannot be returned', bullets: ['Products with broken seals on hygiene-sensitive items such as earbuds, where applicable.', 'Products damaged by misuse.', 'Products without original packaging or accessories.'] },
      { heading: 'How to request a return', paragraphs: ['Contact our support team through the Contact Us page with your order number and a short description of the issue.'] },
      { heading: 'Refunds', paragraphs: ['After the returned item is received and checked, the refund is issued to the original payment method within 5-7 business days. Shipping charges are refunded only if the return is due to our error.'] },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'Placeholder document',
    sections: [
      { heading: 'Information we collect', bullets: ['Account details such as name, email address and phone number.', 'Delivery and billing addresses.', 'Order history and the products you view, wishlist or review.', 'Messages you send us through the contact form.'] },
      { heading: 'How we use your information', bullets: ['To process and deliver your orders.', 'To manage your account and provide customer support.', 'To send updates you have subscribed to, such as our newsletter.', 'To improve our website and products.'] },
      { heading: 'Cookies and local storage', paragraphs: ['This website stores some data in your browser, such as your cart and wishlist, so they are available when you come back.'] },
      { heading: 'Sharing of information', paragraphs: ['We share information only with partners needed to run the store, such as courier and payment providers, and where required by law.'] },
      { heading: 'Your choices', paragraphs: ['You can update your profile and addresses in My Account, unsubscribe from emails, and contact us to ask about your data.'] },
      { heading: 'Contact', paragraphs: ['For privacy questions, use the Contact Us page.'] },
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    updated: 'Placeholder document',
    sections: [
      { heading: 'Acceptance of terms', paragraphs: ['By using this website you agree to these terms. If you do not agree, please do not use the website.'] },
      { heading: 'Your account', paragraphs: ['You are responsible for keeping your login details safe and for activity under your account. Provide accurate information when you register and order.'] },
      { heading: 'Products and pricing', paragraphs: ['We try to keep product information and prices accurate, but mistakes can happen. We may cancel an order if a product is listed with a wrong price or is out of stock.'] },
      { heading: 'Orders and payment', paragraphs: ['An order is confirmed only after we accept it. Payment methods and rules will be described at checkout.'] },
      { heading: 'Shipping and returns', paragraphs: ['Shipping and returns are governed by our Shipping Policy and Return Policy.'] },
      { heading: 'Intellectual property', paragraphs: ['Website content, logos and designs belong to the store or its licensors and may not be copied without permission.'] },
      { heading: 'Limitation of liability', paragraphs: ['To the extent allowed by law, we are not liable for indirect or incidental losses arising from use of the website. Final wording to be added after legal review.'] },
      { heading: 'Changes and governing law', paragraphs: ['We may update these terms from time to time. Governing law and jurisdiction: [to be added after legal review].'] },
    ],
  },
}