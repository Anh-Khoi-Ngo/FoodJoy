import { useState, useCallback, useRef } from 'react'
import { SignInButton } from '@clerk/react'
import { useAuth } from '@clerk/react'
import { searchMeals } from '../api/theMealDb'
import SearchBar from '../components/SearchBar'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEALS = ['Breakfast', 'Lunch', 'Dinner']

const emptyPlan = () => {
  const plan = {}
  DAYS.forEach(d => {
    plan[d] = {}
    MEALS.forEach(m => { plan[d][m] = null })
  })
  return plan
}

export default function MealPlannerPage() {
  const { isSignedIn } = useAuth()
  const [plan, setPlan] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mealPlan')) || emptyPlan() }
    catch { return emptyPlan() }
  })
  const [searchDay, setSearchDay] = useState('')
  const [searchMeal, setSearchMeal] = useState('')
  const [results, setResults] = useState([])
  const timerRef = useRef(null)

  const handleSearch = useCallback((q) => {
    clearTimeout(timerRef.current)
    if (!q) { setResults([]); return }
    timerRef.current = setTimeout(async () => {
      const data = await searchMeals(q)
      setResults(data.slice(0, 6))
    }, 300)
  }, [])

  if (!isSignedIn) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--neutral-900)' }}>Meal Planner</h1>
        <p className="mb-6" style={{ color: 'var(--neutral-600)' }}>Sign in to create your weekly meal plan.</p>
        <SignInButton mode="modal">
          <button className="px-6 py-2 rounded-lg text-white font-medium" style={{ background: 'var(--primary-red)' }}>Sign In</button>
        </SignInButton>
      </main>
    )
  }

  function savePlan(newPlan) {
    setPlan(newPlan)
    localStorage.setItem('mealPlan', JSON.stringify(newPlan))
  }

  function assignMeal(meal) {
    if (!searchDay || !searchMeal) return
    const newPlan = { ...plan }
    newPlan[searchDay] = { ...newPlan[searchDay], [searchMeal]: meal }
    savePlan(newPlan)
    setResults([])
    setSearchDay('')
    setSearchMeal('')
  }

  function removeMeal(day, slot) {
    const newPlan = { ...plan }
    newPlan[day] = { ...newPlan[day], [slot]: null }
    savePlan(newPlan)
  }

  function handleDragStart(e, day, slot) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ day, slot }))
  }

  function handleDrop(e, targetDay, targetSlot) {
    e.preventDefault()
    try {
      const src = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (src.day === targetDay && src.slot === targetSlot) return
      const newPlan = { ...plan }
      const temp = newPlan[targetDay][targetSlot]
      newPlan[targetDay][targetSlot] = newPlan[src.day][src.slot]
      newPlan[src.day][src.slot] = temp
      savePlan(newPlan)
    } catch { /* invalid drag data */ }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--neutral-900)' }}>Meal Planner</h1>
      <p className="mb-6 text-sm" style={{ color: 'var(--neutral-600)' }}>Plan your weekly meals in a few simple steps.</p>

      {/* Instructions */}
      <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--neutral-100)', border: '1px solid var(--neutral-300)' }}>
        <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--primary-red)' }}>How to plan</h2>
        <ol className="text-sm list-decimal ml-5 space-y-1" style={{ color: 'var(--neutral-600)' }}>
          <li>Pick a <strong>Day</strong> and a <strong>Meal</strong> slot (Breakfast, Lunch, or Dinner).</li>
          <li>Type a recipe name in the search bar and click Search.</li>
          <li>Click a recipe from the results to assign it to that slot.</li>
          <li>To rearrange, <strong>drag</strong> a recipe from one slot and <strong>drop</strong> it onto another.</li>
          <li>Click <strong>Remove</strong> to clear a slot.</li>
        </ol>
        <p className="text-xs mt-2" style={{ color: 'var(--neutral-600)' }}>Your plan is saved automatically in your browser.</p>
      </div>

      <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--neutral-200)' }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--neutral-900)' }}>Add a Meal</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <select value={searchDay} onChange={e => setSearchDay(e.target.value)} className="px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: 'var(--neutral-300)' }}>
            <option value="">Select Day</option>
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={searchMeal} onChange={e => setSearchMeal(e.target.value)} className="px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: 'var(--neutral-300)' }}>
            <option value="">Select Meal</option>
            {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {results.map(r => (
              <button key={r.idMeal} onClick={() => assignMeal(r)} className="flex items-center gap-2 p-2 rounded-lg text-left text-sm hover:bg-white transition-colors" style={{ border: '1px solid var(--neutral-300)' }}>
                <img src={r.strMealThumb} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                <span className="truncate" style={{ color: 'var(--neutral-900)' }}>{r.strMeal}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {DAYS.map(day => (
          <div key={day} className="rounded-xl p-3" style={{ background: 'var(--neutral-100)', 
          border: '1px solid var(--neutral-300)' }}>
            <h3 className="text-sm font-semibold mb-2 text-center" style={{ color: 'var(--primary-red)' }}>{day}</h3>
            {MEALS.map(slot => {
              const item = plan[day]?.[slot]
              return (
                <div
                  key={slot}
                  className="rounded-lg p-2 mb-2 text-center min-h-16 flex flex-col items-center justify-center"
                  style={{ background: item ? 'var(--neutral-200)' : 'var(--neutral-100)', 
                  border: '1px dashed var(--neutral-300)' }}
                  draggable={!!item}
                  onDragStart={e => item && handleDragStart(e, day, slot)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleDrop(e, day, slot)}
                >
                  <span className="text-xs font-medium" style={{ color: 'var(--neutral-600)' }}>{slot}</span>
                  {item ? (
                    <>
                      <img src={item.strMealThumb} alt="" className="w-10 h-10 rounded object-cover my-1" />
                      <span className="text-xs truncate w-full" style={{ color: 'var(--neutral-900)' }}>{item.strMeal}</span>
                      <button onClick={() => removeMeal(day, slot)} className="text-xs mt-1 underline" 
                      style={{ color: 'var(--primary-red)' }}>
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-xs" style={{ color: 'var(--neutral-600)' }}>Drop here</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </main>
  )
}