import mockRecipes from '../data/mockRecipes'

export default function FeaturedRecipes() {
  const featured = mockRecipes.slice(0, 4)

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--neutral-900)' }}>
        Featured Recipes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map(recipe => (
          <article
            key={recipe.id}
            className="rounded-xl overflow-hidden card-hover bg-white"
            style={{ border: '1px solid var(--neutral-300)' }}
          >
            <div className="h-40 w-full overflow-hidden">
              <img src={recipe.image} alt={recipe.title} className="img-rounded" />
            </div>

            <div className="p-4 bg-white">
              <h3 className="text-lg font-medium" style={{ color: 'var(--neutral-900)' }}>
                {recipe.title}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">{recipe.category} • {recipe.prepTime}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: 'var(--primary-red)' }}>
                  View
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}