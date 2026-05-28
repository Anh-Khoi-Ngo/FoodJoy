import { useState, useEffect } from 'react'
import { SignInButton } from '@clerk/react'
import { useAuth } from '@clerk/react'
import { Link } from 'react-router-dom'
import { lookupMeal } from '../api/theMealDb'
import AdBanner from '../components/AdBanner'

export default function FavoritesPage() {
  const { isSignedIn } = useAuth()
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favorites')) || [] } catch { return [] }
  })
  const [meals, setMeals] = useState([])
  const [collections, setCollections] = useState(() => {
    try { return JSON.parse(localStorage.getItem('collections')) || [] } catch { return [] }
  })
  const [newCollection, setNewCollection] = useState('')

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

  function addCollection(e) {
    e.preventDefault()
    if (!newCollection.trim()) return
    const updated = [...collections, { name: newCollection.trim(), ids: [] }]
    setCollections(updated)
    localStorage.setItem('collections', JSON.stringify(updated))
    setNewCollection('')
  }

  function addToCollection(colIndex, mealId) {
    const updated = [...collections]
    if (updated[colIndex].ids.includes(mealId)) return
    updated[colIndex].ids.push(mealId)
    setCollections(updated)
    localStorage.setItem('collections', JSON.stringify(updated))
  }

  function removeCollection(i) {
    const updated = collections.filter((_, idx) => idx !== i)
    setCollections(updated)
    localStorage.setItem('collections', JSON.stringify(updated))
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--neutral-900)' }}>Favorites</h1>

      <AdBanner position="top" />

      {/* Saved Recipes */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary-red)' }}>Saved Recipes</h2>
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
                {collections.length > 0 && (
                  <div className="px-3 pb-3 flex flex-wrap gap-1">
                    {collections.map((col, ci) => (
                      <button key={ci} onClick={() => addToCollection(ci, m.idMeal)} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--neutral-200)', color: 'var(--neutral-600)' }}>+ {col.name}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <AdBanner position="mid" />

      {/* Collections */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary-red)' }}>Collections</h2>
        <form onSubmit={addCollection} className="flex gap-2 mb-4">
          <input value={newCollection} onChange={e => setNewCollection(e.target.value)} placeholder="New collection name…" className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: 'var(--neutral-300)' }} />
          <button type="submit" className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: 'var(--primary-red)' }}>Create</button>
        </form>
        {collections.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--neutral-600)' }}>No collections yet. Create one to group your favorite recipes.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((col, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--neutral-100)', border: '1px solid var(--neutral-300)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold" style={{ color: 'var(--neutral-900)' }}>{col.name}</h3>
                  <button onClick={() => removeCollection(i)} className="text-xs" style={{ color: 'var(--primary-red)' }}>Delete</button>
                </div>
                <p className="text-xs" style={{ color: 'var(--neutral-600)' }}>{col.ids.length} recipes</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <AdBanner position="bottom" />
    </main>
  )
}