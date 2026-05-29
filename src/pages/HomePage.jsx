import { useState, useEffect } from 'react'
import { searchMeals, listCategories, filterByCategory, listAllMeals } from '../api/theMealDb'
import RecipeCard from '../components/RecipeCard'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import FeaturedRecipes from '../components/FeaturedRecipes'
import Categories from '../components/Categories'
import AdBanner from '../components/AdBanner'

const PAGE_SIZE = 12

export default function HomePage() {
  const [meals, setMeals] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)

  // Load categories once
  useEffect(() => { listCategories().then(setCategories).catch(() => {}) }, [])

  // Load meals: All by default, filtered by search or category
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
          // "All" – fetch all recipes by combining all categories
          data = await listAllMeals()
        }
        setMeals(data)
        setPage(1)
      } catch {
        setMeals([])
      }
      setLoading(false)
    }
    load()
  }, [query, selectedCat])

  const totalPages = Math.ceil(meals.length / PAGE_SIZE)
  const paged = meals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilter(cat) {
    setSelectedCat(cat)
    setQuery('')
    if (cat) setHasSearched(true); else setHasSearched(false)
  }

  function handleHeroSearch(q) {
    setQuery(q)
    setSelectedCat('')
    if (q) setHasSearched(true); else setHasSearched(false)
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
            <SearchBar onSearch={handleHeroSearch} />
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner position="top" />

        {/* Featured Recipes + Categories – shown only on default "All" view */}
        {!query && !selectedCat && (
          <>
            <FeaturedRecipes />
            <Categories />
          </>
        )}

        {/* Search hint when user searched */}
        {hasSearched && (
          <p className="mb-4 text-sm" style={{ color: 'var(--neutral-600)' }}>
            {query
              ? `Showing results for "${query}"`
              : selectedCat
                ? `Showing recipes in "${selectedCat}"`
                : ''}
          </p>
        )}

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleFilter('')}
            className={`category-pill text-xs ${!selectedCat && !query ? 'active' : ''}`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.idCategory}
              onClick={() => handleFilter(c.strCategory)}
              className={`category-pill text-xs ${selectedCat === c.strCategory ? 'active' : ''}`}
            >
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
    </>
  )
}