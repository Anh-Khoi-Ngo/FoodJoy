const BASE = 'https://www.themealdb.com/api/json/v1/1'

export async function searchMeals(query = '') {
  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`)
  const data = await res.json()
  return data.meals || []
}

export async function lookupMeal(id) {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`)
  const data = await res.json()
  return data.meals ? data.meals[0] : null
}

export async function listCategories() {
  const res = await fetch(`${BASE}/categories.php`)
  const data = await res.json()
  return data.categories || []
}

export async function filterByCategory(category) {
  const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`)
  const data = await res.json()
  return data.meals || []
}

export async function filterByArea(area) {
  const res = await fetch(`${BASE}/filter.php?a=${encodeURIComponent(area)}`)
  const data = await res.json()
  return data.meals || []
}

/**
 * Fetches ALL recipes by loading every category and deduplicating.
 * This is the proper way to get "all meals" from TheMealDB.
 */
export async function listAllMeals() {
  const cats = await listCategories()
  const results = await Promise.all(cats.map(c => filterByCategory(c.strCategory)))
  const seen = new Set()
  return results.flat().filter(m => {
    if (seen.has(m.idMeal)) return false
    seen.add(m.idMeal)
    return true
  })
}

export function extractIngredients(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ing && ing.trim()) {
      ingredients.push({ ingredient: ing.trim(), measure: measure ? measure.trim() : '' })
    }
  }
  return ingredients
}