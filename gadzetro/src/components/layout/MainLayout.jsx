import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import NewsletterBand from './NewsletterBand.jsx'
import BottomNav from './BottomNav.jsx'


// Scroll to top on page change (but not when the URL only has a #hash).
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => { if (!hash) window.scrollTo(0, 0) }, [pathname, hash])
  return null
}

// Pages where the newsletter band would be a distraction
const HIDE_NEWSLETTER_ON = ['/cart', '/checkout', '/login', '/register', '/forgot-password', '/reset-password', '/account', '/order-success', '/access-denied']

export default function MainLayout() {
  const { pathname } = useLocation()
  const showNewsletter = !HIDE_NEWSLETTER_ON.some((p) => pathname.startsWith(p))
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main-content"><Outlet /></main>
      {showNewsletter && <NewsletterBand />}
      <Footer />
      <BottomNav />
    </>
  )
}
