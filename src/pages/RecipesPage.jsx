import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMeals, listCategories, filterByCategory } from '../api/theMealDb'
import RecipeCard from '../components/RecipeCard'
import Pagination from '../components/Pagination'
import AdBanner from '../components/AdBanner'

const PAGE_SIZE = 12

export default function RecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCat = searchParams.get('category') || ''
  const initialQ = searchParams.get('q') || ''

  const [meals, setMeals] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState(initialQ)
  const [selectedCat, setSelectedCat] = useState(initialCat)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

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
          data = await searchMeals('')
        }
        setMeals(data)
        setPage(1)
      } catch { setMeals([]) }
      setLoading(false)
    }
    load()
  }, [query, selectedCat])

  const totalPages = Math.ceil(meals.length / PAGE_SIZE)
  const paged = meals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilter(cat) {
    setSelectedCat(cat)
    setQuery('')
    const sp = new URLSearchParams(searchParams)
    if (cat) sp.set('category', cat); else sp.delete('category')
    sp.delete('q')
    setSearchParams(sp)
  }

  function handleSearch(e) {
    e.preventDefault()
    const val = e.currentTarget.elements.q.value.trim()
    setQuery(val)
    setSelectedCat('')
    const sp = new URLSearchParams(searchParams)
    if (val) sp.set('q', val); else sp.delete('q')
    sp.delete('category')
    setSearchParams(sp)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--neutral-900)' }}>Recipes</h1>

      <AdBanner position="top" />

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input name="q" defaultValue={query} placeholder="Search recipes…" className="flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: 'var(--neutral-300)' }} />
          <button type="submit" className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: 'var(--primary-red)' }}>Search</button>
        </form>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => handleFilter('')} className={`category-pill text-xs ${!selectedCat ? 'font-semibold' : ''}`} style={!selectedCat ? { background: 'var(--primary-red)', color: '#fff', border: 'none' } : {}}>All</button>
        {categories.map(c => (
          <button key={c.idCategory} onClick={() => handleFilter(c.strCategory)} className="category-pill text-xs" style={selectedCat === c.strCategory ? { background: 'var(--primary-red)', color: '#fff', border: 'none' } : {}}>
            {c.strCategory}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-12" style={{ color: 'var(--neutral-600)' }}>Loading…</p>
      ) : paged.length === 0 ? (
        <p className="text-center py-12" style={{ color: 'var(--neutral-600)' }}>No recipes found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paged.map(m => <RecipeCard key={m.idMeal} meal={m} showCategory />)}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <AdBanner position="bottom" />
    </main>
  )
}