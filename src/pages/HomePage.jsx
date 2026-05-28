import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import FeaturedRecipes from '../components/FeaturedRecipes'
import Categories from '../components/Categories'
import { searchMeals } from '../api/theMealDb'
import RecipeCard from '../components/RecipeCard'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSearch(q) {
    setQuery(q)
    if (!q) { setResults([]); return }
    setLoading(true)
    try {
      const meals = await searchMeals(q)
      setResults(meals)
    } catch {
      setResults([])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <img src="/foodjoy-full-logo.png" alt="FoodJoy" className="h-16 md:h-20 mb-4" />
          <p className="mb-6 text-base" style={{ color: 'var(--neutral-600)' }}>
            Discover delicious recipes and plan your perfect meals
          </p>
          <div className="w-full max-w-xl hero-card">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {query && (
          <p className="mb-4 text-sm" style={{ color: 'var(--neutral-600)' }}>
            {loading ? 'Searching…' : `Found ${results.length} results for "${query}"`}
          </p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {results.map(m => <RecipeCard key={m.idMeal} meal={m} />)}
          </div>
        )}

        <FeaturedRecipes />
        <Categories />
      </main>
    </>
  )
}