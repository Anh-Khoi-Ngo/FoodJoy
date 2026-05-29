import { Link } from 'react-router-dom'

export default function RecipeCard({ meal }) {
  if (!meal) return null
  return (
    <Link
      to={`/recipes/${meal.idMeal}`}
      className="card-hover rounded-xl overflow-hidden bg-white block"
      style={{ border: '1px solid var(--neutral-300)' }}
    >
      <div className="h-44 w-full overflow-hidden">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="img-rounded" />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--neutral-900)' }}>
          {meal.strMeal}
        </h3>
        {meal.strCategory && (
          <div className="mt-1 flex items-center justify-between text-sm" style={{ color: 'var(--neutral-600)' }}>
            <span>{meal.strCategory}</span>
            {meal.strArea && <span>{meal.strArea}</span>}
          </div>
        )}
      </div>
    </Link>
  )
}