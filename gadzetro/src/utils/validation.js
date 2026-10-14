import { z } from 'zod'

export const phoneSchema = z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
export const emailSchema = z.string().trim().min(1, 'Email is required').email('Enter a valid email address')
export const pincodeSchema = z.string().trim().regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit PIN code')
const required = (label, min = 2) => z.string().trim().min(min, `${label} is required`)

export const addressSchema = z.object({
  fullName: required('Full name'),
  phone: phoneSchema,
  line1: z.string().trim().min(5, 'Enter your full address (at least 5 characters)'),
  line2: z.string().trim().optional(),
  city: required('City'),
  state: required('State'),
  pincode: pincodeSchema,
})

export const checkoutSchema = z
  .object({
    customer: z.object({ name: required('Full name'), email: emailSchema, phone: phoneSchema }),
    shipping: addressSchema,
    sameAsShipping: z.boolean(),
    billing: z.any(), // validated below, only when "same as shipping" is unchecked
    shippingMethod: z.enum(['standard', 'express']),
    paymentMethod: z.enum(['cod', 'upi', 'card'], { errorMap: () => ({ message: 'Select a payment method' }) }),
  })
  .superRefine((data, ctx) => {
    if (data.sameAsShipping) return
    const result = addressSchema.safeParse(data.billing)
    if (!result.success) {
      result.error.issues.forEach((issue) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: issue.message, path: ['billing', ...issue.path] })
      )
    }
  })

// ---------- Phase 4: auth, profile, address book, reviews ----------
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Include at least one letter')
  .regex(/\d/, 'Include at least one number')

export function getPasswordStrength(password) {
  let points = 0
  if (password.length >= 8) points += 1
  if (password.length >= 12) points += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1
  if (/\d/.test(password)) points += 1
  if (/[^A-Za-z0-9]/.test(password)) points += 1
  const score = !password ? 0 : password.length < 8 ? Math.min(points, 1) : Math.min(points, 4)
  return { score, label: ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][score] }
}

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
})

export const registerSchema = z
  .object({
    name: required('Full name'),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    // boolean + refine (not z.literal(true)) so the password-match check below still runs when terms is unticked
    terms: z.boolean().refine((v) => v === true, 'You must accept the terms and conditions'),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' })

export const forgotPasswordSchema = z.object({ email: emailSchema })

export const resetPasswordSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string().min(1, 'Please confirm your password') })
  .refine((d) => d.password === d.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' })

export const profileSchema = z.object({ name: required('Full name'), email: emailSchema, phone: phoneSchema })

export const addressBookSchema = z.object({
  label: z.string().trim().min(1, 'Give this address a label (e.g. Home)').max(20, 'Keep the label under 20 characters'),
  isDefault: z.boolean(),
  address: addressSchema,
})

export const reviewSchema = z.object({
  rating: z.number({ invalid_type_error: 'Select a rating' }).int().min(1, 'Select a rating').max(5),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(80, 'Keep the title under 80 characters'),
  text: z.string().trim().min(10, 'Write at least 10 characters').max(1000, 'Keep the review under 1000 characters'),
})


// ---------- Phase 5: contact + newsletter ----------
export const contactSchema = z.object({
  name: required('Name'),
  email: emailSchema,
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(100, 'Keep the subject under 100 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(1000, 'Keep the message under 1000 characters'),
})

export const newsletterSchema = z.object({ email: emailSchema })


// ---------- Phase 6: admin forms ----------
const count = (label, min, max, extra = '') =>
  z.coerce.number({ invalid_type_error: 'Enter a number' }).int(`${label} must be a whole number`).min(min, `${label} must be at least ${min}`).max(max, `${label} must be at most ${max}${extra}`)

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(40, 'Keep the name under 40 characters'),
  description: z.string().trim().min(5, 'Add a short description (at least 5 characters)').max(200, 'Keep it under 200 characters'),
  image: z.string().trim().optional(),
  banner: z.string().trim().optional(),
})

export const brandSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(40, 'Keep the name under 40 characters'),
  description: z.string().trim().min(5, 'Add a short description (at least 5 characters)').max(200, 'Keep it under 200 characters'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Pick a valid colour'),
})

export const couponSchema = z
  .object({
    code: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{3,20}$/, 'Use 3 to 20 letters or numbers (no spaces)'),
    type: z.enum(['percent', 'flat', 'freeShipping']),
    value: z.coerce.number({ invalid_type_error: 'Enter a number' }).min(0, 'Value cannot be negative'),
    maxDiscount: z.coerce.number({ invalid_type_error: 'Enter a number' }).min(0, 'Cannot be negative'),
    minSubtotal: count('Minimum order', 0, 1000000),
    description: z.string().trim().min(5, 'Add a short description (at least 5 characters)').max(120, 'Keep it under 120 characters'),
    active: z.boolean(),
  })
  .superRefine((d, ctx) => {
    if (d.type === 'percent' && (d.value < 1 || d.value > 90)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['value'], message: 'Percent must be between 1 and 90' })
    if (d.type === 'flat' && d.value < 1) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['value'], message: 'Flat discount must be at least ₹1' })
  })

export const productSchema = z.object({
  name: z.string().trim().min(3, 'Product name must be at least 3 characters').max(120, 'Keep the name under 120 characters'),
  sku: z.string().trim().min(3, 'SKU must be at least 3 characters').max(30, 'Keep the SKU under 30 characters').regex(/^[A-Za-z0-9_-]+$/, 'Use letters, numbers, - or _ only'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000, 'Keep it under 1000 characters'),
  categoryId: z.string().min(1, 'Select a category'),
  brandId: z.string().min(1, 'Select a brand'),
  mrp: count('Price', 1, 1000000),
  discount: count('Discount', 0, 90),
  stock: count('Stock', 0, 100000),
  status: z.enum(['active', 'draft']),
  image: z.string().min(1, 'Choose or upload an image'),
  highlights: z.string().optional(),
  specs: z.string().optional(),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  isNewArrival: z.boolean(),
})


// ---------- Phase 6 (part B): settings ----------
export const settingsSchema = z.object({
  storeName: z.string().trim().min(2, 'Store name must be at least 2 characters').max(40, 'Keep the store name under 40 characters'),
  contactEmail: emailSchema,
  logo: z.string().trim().min(1, 'Choose a logo or enter a logo path'),
  shippingCharge: count('Shipping charge', 0, 5000),
  expressShippingCharge: count('Express charge', 0, 10000),
  freeShippingThreshold: count('Free shipping limit', 0, 1000000),
  taxPercent: z.coerce.number({ invalid_type_error: 'Enter a number' }).min(0, 'Tax cannot be negative').max(40, 'Tax cannot be more than 40%'),
})