import { useState, useEffect } from 'react'
import { SignInButton } from '@clerk/react'
import { useAuth } from '@clerk/react'
import { Link } from 'react-router-dom'
import { lookupMeal } from '../api/theMealDb'

export default function FavoritesPage() {
  const { isSignedIn } = useAuth()
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favorites')) || [] } catch { return [] }
  })
  const [meals, setMeals] = useState([])

  useEffect(() => {
    async function load() {
      const loaded = await Promise.all(favorites.map(id => lookupMeal(id)))
      setMeals(loaded.filter(Boolean))
    }
    load()
  }, [favorites])

  if (!isSignedIn) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--neutral-900)' }}>Favorites</h1>
        <p className="mb-6" style={{ color: 'var(--neutral-600)' }}>Sign in to save your favorite recipes.</p>
        <SignInButton mode="modal">
          <button className="px-6 py-2 rounded-lg text-white font-medium" style={{ background: 'var(--primary-red)' }}>Sign In</button>
        </SignInButton>
      </main>
    )
  }

  function removeFavorite(id) {
    const updated = favorites.filter(f => f !== id)
    setFavorites(updated)
    localStorage.setItem('favorites', JSON.stringify(updated))
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--neutral-900)' }}>Favorites</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary-red)' }}>Liked Recipes</h2>
        {meals.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--neutral-600)' }}>No favorites yet. Browse recipes and tap the heart to save.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {meals.map(m => (
              <div key={m.idMeal} className="card-hover rounded-xl overflow-hidden bg-white relative" style={{ border: '1px solid var(--neutral-300)' }}>
                <Link to={`/recipes/${m.idMeal}`}>
                  <div className="h-40 w-full overflow-hidden">
                    <img src={m.strMealThumb} alt={m.strMeal} className="img-rounded" />
                  </div>
                </Link>
                <div className="p-3 flex items-center justify-between">
                  <Link to={`/recipes/${m.idMeal}`} className="text-sm font-semibold truncate" style={{ color: 'var(--neutral-900)' }}>{m.strMeal}</Link>
                  <button onClick={() => removeFavorite(m.idMeal)} className="text-sm" style={{ color: 'var(--accent-heart)' }} aria-label="Remove from favorites">♥</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}