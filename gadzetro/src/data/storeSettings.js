// Demo store settings. Edit them in Admin > Settings (saved in localStorage and loaded below).
import { loadFromStorage } from '../utils/storage.js'

export const storeSettings = {
  storeName: 'Gadzetro',
  logo: '/images/logo/logo.png',
  contactEmail: 'support@gadzetro.example',
  currency: 'INR',
  shippingCharge: 49, // standard delivery charge
  expressShippingCharge: 149,
  freeShippingThreshold: 999, // standard delivery is free at or above this subtotal
  taxRate: 0.18, // estimated GST used for the demo
}

export const MAX_QTY_PER_ITEM = 10

const savedSettings = loadFromStorage('settings', null)
if (savedSettings) Object.assign(storeSettings, savedSettings)