import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

export default function Nav() {
  return (
    <header className="w-full shadow-soft" style={{ boxShadow: 'var(--shadow-soft)' }}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="text-lg font-semibold" style={{ color: 'var(--primary-red)' }}>
            FoodJoy
          </a>

          <ul className="hidden md:flex items-center gap-4 text-sm text-neutral-600">
            <li><a href="/" className="hover:text-neutral-900">Home</a></li>
            <li><a href="/recipes" className="hover:text-neutral-900">Recipes</a></li>
            <li><a href="/meal-planner" className="hover:text-neutral-900">Meal Planner</a></li>
            <li><a href="/favorites" className="hover:text-neutral-900">Favorites</a></li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <div className="flex gap-2">
              <SignInButton>
                <button className="px-3 py-1 rounded-md text-sm border" style={{ borderColor: 'var(--neutral-300)' }}>
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-3 py-1 rounded-md text-sm bg-[var(--primary-red)] text-white" style={{ backgroundColor: 'var(--primary-red)' }}>
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  )
}