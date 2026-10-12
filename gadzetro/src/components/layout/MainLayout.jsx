import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// Scroll to top on page change (but not when the URL only has a #hash).
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => { if (!hash) window.scrollTo(0, 0) }, [pathname, hash])
  return null
}

export default function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main-content"><Outlet /></main>
      <Footer />
    </>
  )
}
