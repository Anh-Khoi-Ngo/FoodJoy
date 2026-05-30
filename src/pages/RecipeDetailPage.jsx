import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/react'
import { lookupMeal, searchMeals, extractIngredients } from '../api/theMealDb'
import RecipeCard from '../components/RecipeCard'

function getYoutubeId(url) {
  if (!url) return ''
  const match = url.match(/(?:v=|\/)([\w-]{11})(?:\?|&|$)/)
  return match ? match[1] : ''
}

export default function RecipeDetailPage() {
  const { id } = useParams()
  const { isSignedIn } = useAuth()
  const [meal, setMeal] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorited, setFavorited] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
      return favs.includes(id)
    } catch { return false }
  })
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const m = await lookupMeal(id)
        if (cancelled) return
        setMeal(m)
        if (m) {
          const rel = await searchMeals(m.strCategory || '')
          if (!cancelled) setRelated(rel.filter(r => r.idMeal !== id).slice(0, 4))
        }
      } catch {
        if (!cancelled) { setMeal(null); setRelated([]) }
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [id])

  function toggleFavorite() {
    if (!isSignedIn) {
      setShowSignInPrompt(true)
      setTimeout(() => setShowSignInPrompt(false), 4000)
      return
    }
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (favorited) {
      const updated = favs.filter(f => f !== id)
      localStorage.setItem('favorites', JSON.stringify(updated))
      setFavorited(false)
    } else {
      favs.push(id)
      localStorage.setItem('favorites', JSON.stringify(favs))
      setFavorited(true)
    }
  }

  if (loading) return <main className="max-w-6xl mx-auto px-4 py-12 text-center" style={{ color: 'var(--neutral-600)' }}>Loading…</main>
  if (!meal) return <main className="max-w-6xl mx-auto px-4 py-12 text-center" style={{ color: 'var(--neutral-600)' }}>Recipe not found.</main>

  const ingredients = extractIngredients(meal)
  const steps = (meal.strInstructions || '').split(/\r?\n/).filter(s => s.trim())
  const youtubeId = getYoutubeId(meal.strYoutube)

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showSignInPrompt && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 text-sm" style={{ background: 'var(--neutral-100)', border: '1px solid var(--neutral-300)', maxWidth: 400 }}>
          <span style={{ color: 'var(--neutral-900)' }}>Sign in to like recipes</span>
          <SignInButton mode="modal">
            <button className="px-3 py-1.5 rounded-lg text-white text-xs font-medium" style={{ background: 'var(--primary-red)' }}>Sign In</button>
          </SignInButton>
          <button onClick={() => setShowSignInPrompt(false)} className="text-xs" style={{ color: 'var(--neutral-600)' }}>✕</button>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--neutral-600)' }}>
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="truncate max-w-50" style={{ color: 'var(--neutral-900)' }}>{meal.strMeal}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-medium)' }}>
            <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-72 sm:h-96 object-cover" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full" style={{ background: 'var(--secondary-green-light)', color: 'var(--neutral-900)' }}>{meal.strCategory}</span>
            <span className="px-3 py-1 rounded-full" style={{ background: 'var(--neutral-200)', color: 'var(--neutral-600)' }}>{meal.strArea}</span>
            <button
              onClick={toggleFavorite}
              className="ml-auto px-3 py-1 rounded-full text-sm font-medium transition-all duration-150"
              style={{ background: favorited ? 'var(--accent-heart)' : 'var(--neutral-200)', color: favorited ? '#fff' : 'var(--neutral-600)' }}
            >
              {favorited ? '♥ Liked' : '♡ Like'}
            </button>
          </div>
        </div>

        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--neutral-900)' }}>{meal.strMeal}</h1>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--secondary-green)' }}><span>🧂</span> Ingredients</h2>
          <ul className="space-y-2 mb-6">
            {ingredients.map(({ ingredient, measure }) => (
              <li key={ingredient} className="flex justify-between text-sm py-1.5 px-2 rounded-lg" style={{ background: 'var(--neutral-200)', color: 'var(--neutral-900)' }}>
                <span className="font-medium">{ingredient}</span>
                <span style={{ color: 'var(--neutral-600)' }}>{measure}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-8 p-6 rounded-xl" style={{ background: 'var(--neutral-200)' }}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--secondary-green)' }}><span>📋</span> Instructions</h2>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--neutral-900)' }}>
              <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-white text-xs font-bold" style={{ background: 'var(--secondary-green)' }}>{i + 1}</span>
              <p className="pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {youtubeId && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--secondary-green)' }}><span>🎥</span> Video</h2>
          <div className="aspect-video rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-medium)' }}>
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}`} title="Recipe video" allowFullScreen />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--neutral-900)' }}>Related Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(r => <RecipeCard key={r.idMeal} meal={r} />)}
          </div>
        </section>
      )}
    </main>
  )
}