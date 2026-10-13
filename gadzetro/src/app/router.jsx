import { Navigate, createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout.jsx'
import HomePage from '../pages/home/HomePage.jsx'
import AboutPage from '../pages/informational/AboutPage.jsx'
import ContactPage from '../pages/informational/ContactPage.jsx'
import FaqPage from '../pages/informational/FaqPage.jsx'
import PolicyPage from '../pages/informational/PolicyPage.jsx'
import AccountLayout from '../components/layout/AccountLayout.jsx'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import ComingSoonPage from '../pages/placeholder/ComingSoonPage.jsx'
import NotFoundPage from '../pages/errors/NotFoundPage.jsx'
import UiKitPage from '../pages/dev/UiKitPage.jsx'
import ShopPage from '../pages/shop/ShopPage.jsx'
import SearchPage from '../pages/shop/SearchPage.jsx'
import CategoryPage from '../pages/category/CategoryPage.jsx'
import ProductDetailsPage from '../pages/product/ProductDetailsPage.jsx'
import BrandsPage from '../pages/brand/BrandsPage.jsx'
import BrandDetailsPage from '../pages/brand/BrandDetailsPage.jsx'
import DealsPage from '../pages/deals/DealsPage.jsx'
import WishlistPage from '../pages/shop/WishlistPage.jsx'
import CartPage from '../pages/cart/CartPage.jsx'
import CheckoutPage from '../pages/checkout/CheckoutPage.jsx'
import OrderSuccessPage from '../pages/checkout/OrderSuccessPage.jsx'
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'
import AccessDeniedPage from '../pages/auth/AccessDeniedPage.jsx'
import AdminLoginPage from '../pages/admin/AdminLoginPage.jsx'
import AccountDashboardPage from '../pages/account/AccountDashboardPage.jsx'
import ProfilePage from '../pages/account/ProfilePage.jsx'
import AddressesPage from '../pages/account/AddressesPage.jsx'
import OrdersPage from '../pages/account/OrdersPage.jsx'
import OrderDetailsPage from '../pages/account/OrderDetailsPage.jsx'
import ReviewsPage from '../pages/account/ReviewsPage.jsx'
import '../styles/variables.css'
import '../styles/utilities.css'
import '../styles/layouts.css'

// Each entry is [path, title, phase it gets built in]. Used only for pages still to come (admin pages, Phase 6).
const toRoutes = (list) => list.map(([path, title, phase]) => ({ path, element: <ComingSoonPage title={title} phase={phase} /> }))

const shopRoutes = [
  { path: 'shop', element: <ShopPage /> },
  { path: 'category/:categorySlug', element: <CategoryPage /> },
  { path: 'product/:productSlug', element: <ProductDetailsPage /> },
  { path: 'search', element: <SearchPage /> },
  { path: 'brands', element: <BrandsPage /> },
  { path: 'brand/:brandSlug', element: <BrandDetailsPage /> },
  { path: 'deals', element: <DealsPage /> },
  { path: 'wishlist', element: <WishlistPage /> },
  { path: 'cart', element: <CartPage /> },
  { path: 'checkout', element: <CheckoutPage /> },
  { path: 'order-success/:orderId', element: <OrderSuccessPage /> },
]
const authRoutes = [
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'forgot-password', element: <ForgotPasswordPage /> },
  { path: 'reset-password', element: <ResetPasswordPage /> },
  { path: 'access-denied', element: <AccessDeniedPage /> },
]
const infoRoutes = [
  { path: 'about', element: <AboutPage /> },
  { path: 'contact', element: <ContactPage /> },
  { path: 'faq', element: <FaqPage /> },
  { path: 'shipping-policy', element: <PolicyPage policyKey="shipping" /> },
  { path: 'return-policy', element: <PolicyPage policyKey="returns" /> },
  { path: 'privacy-policy', element: <PolicyPage policyKey="privacy" /> },
  { path: 'terms', element: <PolicyPage policyKey="terms" /> },
]
const accountRoutes = [
  { index: true, element: <AccountDashboardPage /> },
  { path: 'profile', element: <ProfilePage /> },
  { path: 'addresses', element: <AddressesPage /> },
  { path: 'orders', element: <OrdersPage /> },
  { path: 'orders/:orderId', element: <OrderDetailsPage /> },
  { path: 'reviews', element: <ReviewsPage /> },
]
const adminRoutes = toRoutes([
  ['dashboard', 'Admin Dashboard', 6], ['products', 'Admin Products', 6], ['products/new', 'Add Product', 6],
  ['products/:productId/edit', 'Edit Product', 6], ['categories', 'Admin Categories', 6], ['brands', 'Admin Brands', 6],
  ['orders', 'Admin Orders', 6], ['orders/:orderId', 'Admin Order Details', 6], ['customers', 'Admin Customers', 6],
  ['coupons', 'Admin Coupons', 6], ['reviews', 'Admin Reviews', 6], ['settings', 'Admin Settings', 6],
])

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      ...shopRoutes,
      ...authRoutes,
      ...infoRoutes,
      { path: 'account', element: <ProtectedRoute><AccountLayout /></ProtectedRoute>, children: accountRoutes },
      { path: 'ui-kit', element: <UiKitPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: <ProtectedRoute role="admin" loginPath="/admin/login"><AdminLayout /></ProtectedRoute>,
    children: [{ index: true, element: <Navigate to="dashboard" replace /> }, ...adminRoutes],
  },
])










// import { Navigate, createBrowserRouter } from 'react-router-dom'
// import App from '../App.jsx' // existing homepage, unchanged
// import MainLayout from '../components/layout/MainLayout.jsx'
// import AccountLayout from '../components/layout/AccountLayout.jsx'
// import AdminLayout from '../components/layout/AdminLayout.jsx'
// import ComingSoonPage from '../pages/placeholder/ComingSoonPage.jsx'
// import NotFoundPage from '../pages/errors/NotFoundPage.jsx'
// import UiKitPage from '../pages/dev/UiKitPage.jsx'
// import ShopPage from '../pages/shop/ShopPage.jsx'
// import SearchPage from '../pages/shop/SearchPage.jsx'
// import CategoryPage from '../pages/category/CategoryPage.jsx'
// import ProductDetailsPage from '../pages/product/ProductDetailsPage.jsx'
// import BrandsPage from '../pages/brand/BrandsPage.jsx'
// import BrandDetailsPage from '../pages/brand/BrandDetailsPage.jsx'
// import DealsPage from '../pages/deals/DealsPage.jsx'
// import WishlistPage from '../pages/shop/WishlistPage.jsx'
// import CartPage from '../pages/cart/CartPage.jsx'
// import CheckoutPage from '../pages/checkout/CheckoutPage.jsx'
// import OrderSuccessPage from '../pages/checkout/OrderSuccessPage.jsx'
// import ProtectedRoute from '../components/auth/ProtectedRoute.jsx'
// import LoginPage from '../pages/auth/LoginPage.jsx'
// import RegisterPage from '../pages/auth/RegisterPage.jsx'
// import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
// import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'
// import AccessDeniedPage from '../pages/auth/AccessDeniedPage.jsx'
// import AdminLoginPage from '../pages/admin/AdminLoginPage.jsx'
// import AccountDashboardPage from '../pages/account/AccountDashboardPage.jsx'
// import ProfilePage from '../pages/account/ProfilePage.jsx'
// import AddressesPage from '../pages/account/AddressesPage.jsx'
// import OrdersPage from '../pages/account/OrdersPage.jsx'
// import OrderDetailsPage from '../pages/account/OrderDetailsPage.jsx'
// import ReviewsPage from '../pages/account/ReviewsPage.jsx'
// import '../styles/variables.css'
// import '../styles/utilities.css'
// import '../styles/layouts.css'
// import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx'
// import AdminOrdersPage from '../pages/admin/AdminOrdersPage.jsx'
// import AdminOrderDetailsPage from '../pages/admin/AdminOrderDetailsPage.jsx'
// import AdminProductsPage from '../pages/admin/AdminProductsPage.jsx'
// import AdminCustomersPage from '../pages/admin/AdminCustomersPage.jsx'

// // Each entry is [path, title, phase it gets built in]. In later phases, replace the placeholder with the real page.
// const toRoutes = (list) => list.map(([path, title, phase]) => ({ path, element: <ComingSoonPage title={title} phase={phase} /> }))

// const shopRoutes = [
//   { path: 'shop', element: <ShopPage /> },
//   { path: 'category/:categorySlug', element: <CategoryPage /> },
//   { path: 'product/:productSlug', element: <ProductDetailsPage /> },
//   { path: 'search', element: <SearchPage /> },
//   { path: 'brands', element: <BrandsPage /> },
//   { path: 'brand/:brandSlug', element: <BrandDetailsPage /> },
//   { path: 'deals', element: <DealsPage /> },
//   { path: 'wishlist', element: <WishlistPage /> },
//   { path: 'cart', element: <CartPage /> },
//   { path: 'checkout', element: <CheckoutPage /> },
//   { path: 'order-success/:orderId', element: <OrderSuccessPage /> },
// ]
// const authRoutes = [
//   { path: 'login', element: <LoginPage /> },
//   { path: 'register', element: <RegisterPage /> },
//   { path: 'forgot-password', element: <ForgotPasswordPage /> },
//   { path: 'reset-password', element: <ResetPasswordPage /> },
//   { path: 'access-denied', element: <AccessDeniedPage /> },
// ]
// const infoRoutes = toRoutes([
//   ['about', 'About Us', 5], ['contact', 'Contact Us', 5], ['faq', 'FAQs', 5], ['shipping-policy', 'Shipping Policy', 5],
//   ['return-policy', 'Return Policy', 5], ['privacy-policy', 'Privacy Policy', 5], ['terms', 'Terms and Conditions', 5],
// ])
// const accountRoutes = [
//   { index: true, element: <AccountDashboardPage /> },
//   { path: 'profile', element: <ProfilePage /> },
//   { path: 'addresses', element: <AddressesPage /> },
//   { path: 'orders', element: <OrdersPage /> },
//   { path: 'orders/:orderId', element: <OrderDetailsPage /> },
//   { path: 'reviews', element: <ReviewsPage /> },
// ]
// // const adminRoutes = toRoutes([
// //   ['dashboard', 'Admin Dashboard', 6], ['products', 'Admin Products', 6], ['products/new', 'Add Product', 6],
// //   ['products/:productId/edit', 'Edit Product', 6], ['categories', 'Admin Categories', 6], ['brands', 'Admin Brands', 6],
// //   ['orders', 'Admin Orders', 6], ['orders/:orderId', 'Admin Order Details', 6], ['customers', 'Admin Customers', 6],
// //   ['coupons', 'Admin Coupons', 6], ['reviews', 'Admin Reviews', 6], ['settings', 'Admin Settings', 6],
// // ])

// const adminRoutes = [
//   { path: 'dashboard', element: <AdminDashboardPage /> },
//   { path: 'products', element: <AdminProductsPage /> },
//   { path: 'orders', element: <AdminOrdersPage /> },
//   { path: 'orders/:orderId', element: <AdminOrderDetailsPage /> },
//   { path: 'customers', element: <AdminCustomersPage /> },
//   // Ye abhi placeholder hain (inke liye backend chahiye):
//   ...toRoutes([
//     ['products/new', 'Add Product', 6], ['products/:productId/edit', 'Edit Product', 6], ['categories', 'Admin Categories', 6],
//     ['brands', 'Admin Brands', 6], ['coupons', 'Admin Coupons', 6], ['reviews', 'Admin Reviews', 6], ['settings', 'Admin Settings', 6],
//   ]),
// ]

// export const router = createBrowserRouter([
//   // { path: '/', element: <App /> },
//   {
//     element: <MainLayout />,
//     children: [
//       { index: true, element: <App /> },   // <-- NEW
//       ...shopRoutes,
//       ...shopRoutes,
//       ...authRoutes,
//       ...infoRoutes,
//       { path: 'account', element: <ProtectedRoute><AccountLayout /></ProtectedRoute>, children: accountRoutes },
//       { path: 'ui-kit', element: <UiKitPage /> },
//       { path: '*', element: <NotFoundPage /> },
//     ],
//   },
//   { path: '/admin/login', element: <AdminLoginPage /> },
//   {
//     path: '/admin',
//     element: <ProtectedRoute role="admin" loginPath="/admin/login"><AdminLayout /></ProtectedRoute>,
//     children: [{ index: true, element: <Navigate to="dashboard" replace /> }, ...adminRoutes],
//   },
// ])
