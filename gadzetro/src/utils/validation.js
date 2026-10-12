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
