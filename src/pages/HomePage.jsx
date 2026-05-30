import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMeals, listCategories, filterByCategory, listAllMeals } from '../api/theMealDb'
import RecipeCard from '../components/RecipeCard'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'

const PAGE_SIZE = 12

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') || ''
  const selectedCat = searchParams.get('cat') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [meals, setMeals] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const hasActiveFilter = !!(query || selectedCat)

  useEffect(() => { listCategories().then(setCategories).catch(() => {}) }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        let data
        if (selectedCat) {
          data = await filterByCategory(selectedCat)
        } else if (query) {
          data = await searchMeals(query)
        } else {
          data = await listAllMeals()
        }
        setMeals(data)
      } catch {
        setMeals([])
      }
      setLoading(false)
    }
    load()
  }, [query, selectedCat])

  const totalPages = Math.ceil(meals.length / PAGE_SIZE)
  const paged = meals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function updateUrl(newQ, newCat, newPage) {
    const params = new URLSearchParams()
    if (newQ) params.set('q', newQ)
    if (newCat) params.set('cat', newCat)
    if (newPage > 1) params.set('page', String(newPage))
    setSearchParams(params, { replace: true })
  }

  function handleFilter(cat) { updateUrl('', cat, 1) }
  function handleHeroSearch(q) { updateUrl(q, '', 1) }
  function handlePageChange(newPage) { updateUrl(query, selectedCat, newPage) }

  return (
    <>
      <section className="hero">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <img src="/foodjoy-full-logo.png" alt="FoodJoy" className="h-16 md:h-20 mb-4" />
          <p className="mb-6 text-base" style={{ color: 'var(--neutral-600)' }}>
            Discover delicious recipes and plan your perfect meals
          </p>
          <div className="w-full max-w-xl hero-card">
            <SearchBar onSearch={handleHeroSearch} />
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasActiveFilter && (
          <p className="mb-4 text-sm" style={{ color: 'var(--neutral-600)' }}>
            {query ? `Showing results for "${query}"` : `Showing recipes in "${selectedCat}"`}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => handleFilter('')} className={`category-pill text-xs ${!selectedCat && !query ? 'active' : ''}`}>All</button>
          {categories.map(c => (
            <button key={c.idCategory} onClick={() => handleFilter(c.strCategory)} className={`category-pill text-xs ${selectedCat === c.strCategory ? 'active' : ''}`}>{c.strCategory}</button>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-12" style={{ color: 'var(--neutral-600)' }}>Loading…</p>
        ) : paged.length === 0 ? (
          <p className="text-center py-12" style={{ color: 'var(--neutral-600)' }}>No recipes found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paged.map(m => <RecipeCard key={m.idMeal} meal={m} />)}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </main>
    </>
  )
}