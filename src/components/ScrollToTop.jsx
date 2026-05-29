import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const scrollPositions = new Map()

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    // Save current scroll position before leaving a page
    if (prevPath.current !== pathname) {
      scrollPositions.set(prevPath.current, window.scrollY)
      prevPath.current = pathname
    }

    // Restore saved scroll position for this page, or scroll to top if none saved
    const saved = scrollPositions.get(pathname)
    if (saved !== undefined) {
      // Use requestAnimationFrame to ensure DOM is rendered before scrolling
      requestAnimationFrame(() => window.scrollTo(0, saved))
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}