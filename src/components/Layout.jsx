import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

// Only call once at module init to prevent default scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

export default function Layout({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    // Ensure we are at the very top
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return (
    <>
      <Nav />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  )
}
