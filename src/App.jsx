import './App.css'
import { useState } from 'react'
import Nav from './components/Nav'
import SearchBar from './components/SearchBar'
import FeaturedRecipes from './components/FeaturedRecipes'
import Categories from './components/Categories'

function App() {
  const [query, setQuery] = useState('')

  function handleSearch(q) {
    setQuery(q)
  }

  return (
    <>
      <Nav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={handleSearch} />
        {query && (
          <p className="mt-4 text-sm" style={{ color: 'var(--neutral-600)' }}>
            Showing results for "{query}"
          </p>
        )}

        <FeaturedRecipes />

        <Categories />
      </main>
    </>
  )
}

export default App
