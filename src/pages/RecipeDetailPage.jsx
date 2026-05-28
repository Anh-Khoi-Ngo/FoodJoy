import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { lookupMeal, searchMeals, extractIngredients } from '../api/theMealDb'
import RecipeCard from '../components/RecipeCard'
import AdBanner from '../components/AdBanner'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const [meal, setMeal] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) return <main className="max-w-6xl mx-auto px-4 py-12 text-center" style={{ color: 'var(--neutral-600)' }}>Loading…</main>
  if (!meal) return <main className="max-w-6xl mx-auto px-4 py-12 text-center" style={{ color: 'var(--neutral-600)' }}>Recipe not found.</main>

  const ingredients = extractIngredients(meal)
  const steps = (meal.strInstructions || '').split(/\r?\n/).filter(s => s.trim())

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdBanner position="top" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Hero image + meta */}
        <div className="lg:w-1/2">
          <div className="rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-medium)' }}>
            <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-64 sm:h-80 object-cover" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 rounded-full" style={{ background: 'var(--neutral-200)', color: 'var(--neutral-600)' }}>{meal.strCategory}</span>
            <span className="px-3 py-1 rounded-full" style={{ background: 'var(--neutral-200)', color: 'var(--neutral-600)' }}>{meal.strArea}</span>
            {meal.strTags && meal.strTags.split(',').map(t => (
              <span key={t} className="px-3 py-1 rounded-full" style={{ background: 'var(--primary-red-light)', color: '#fff', fontSize: 12 }}>{t.trim()}</span>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--neutral-900)' }}>{meal.strMeal}</h1>

          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--primary-red)' }}>Ingredients</h2>
          <ul className="space-y-2 mb-6">
            {ingredients.map(({ ingredient, measure }) => (
              <li key={ingredient} className="flex justify-between text-sm py-1 border-b" style={{ borderColor: 'var(--neutral-300)' }}>
                <span style={{ color: 'var(--neutral-900)' }}>{ingredient}</span>
                <span style={{ color: 'var(--neutral-600)' }}>{measure}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AdBanner position="mid" />

      {/* Instructions */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--primary-red)' }}>Instructions</h2>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--neutral-900)' }}>
              <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-white text-xs" style={{ background: 'var(--primary-red)' }}>{i + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {meal.strYoutube && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--primary-red)' }}>Video</h2>
          <div className="aspect-video rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-medium)' }}>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}`}
              title="Recipe video"
              allowFullScreen
            />
          </div>
        </section>
      )}

      <AdBanner position="bottom" />

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