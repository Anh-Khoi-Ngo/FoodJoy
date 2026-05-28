import mockRecipes from '../data/mockRecipes'

export default function Categories() {
  const categories = Array.from(new Set(mockRecipes.map(r => r.category)))

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--neutral-900)' }}>
        Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map(cat => (
          <button
            key={cat}
            className="category-pill flex items-center justify-center"
          >
            <span className="text-sm font-medium" style={{ color: 'var(--neutral-900)' }}>
              {cat}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}