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
            className="flex items-center justify-center py-4 rounded-lg bg-[var(--neutral-100)] border"
            style={{
              borderColor: 'var(--neutral-300)',
              boxShadow: 'var(--shadow-soft)',
              borderRadius: 'var(--radius)'
            }}
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