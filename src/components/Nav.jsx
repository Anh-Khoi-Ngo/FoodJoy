import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/meal-planner', label: 'Meal Planner' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/blog', label: 'Blog' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  function isActive(to) {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <header className="sticky-nav" style={{ background: 'var(--neutral-100)', borderBottom: '1px solid var(--neutral-300)' }}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center shrink-0">
            <img src="/foodjoy-full-logo.png" alt="FoodJoy" className="h-12 md:h-14" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={isActive(link.to)
                    ? { color: 'var(--secondary-green)', background: 'rgba(76,175,80,0.08)' }
                    : { color: 'var(--neutral-600)' }
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 btn-outline"
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-150"
                style={{ background: 'var(--primary-red)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-red-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--primary-red)'}
              >
                Sign up
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm" style={{ color: 'var(--neutral-600)' }}>My Account</span>
              <UserButton />
            </div>
          </Show>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 rounded" style={{ background: 'var(--neutral-900)', transition: 'transform 200ms', 
              transform: menuOpen ? 'translateY(3.5px) rotate(45deg)' : 'none' }} />
            <span className="block w-5 h-0.5 rounded" style={{ background: 'var(--neutral-900)', opacity: menuOpen ? 0 : 1, 
              transition: 'opacity 200ms' }} />
            <span className="block w-5 h-0.5 rounded" style={{ background: 'var(--neutral-900)', transition: 'transform 200ms', 
              transform: menuOpen ? 'translateY(-3.5px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4" style={{ borderTop: '1px solid var(--neutral-300)' }}>
          <ul className="flex flex-col gap-1">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={isActive(link.to)
                    ? { color: 'var(--secondary-green)', background: 'rgba(76,175,80,0.08)' }
                    : { color: 'var(--neutral-600)' }
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}