import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--neutral-900)', color: 'var(--neutral-300)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <img src="/foodjoy-full-logo.png" alt="FoodJoy" className="h-8 mb-3 brightness-0 invert opacity-90" />
          <p className="text-sm leading-relaxed">Discover delicious recipes and plan your perfect meals.</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Recipes</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/recipes" className="hover:text-white transition-colors">All Recipes</Link></li>
            <li><Link to="/recipes?category=Chicken" className="hover:text-white transition-colors">Chicken</Link></li>
            <li><Link to="/recipes?category=Beef" className="hover:text-white transition-colors">Beef</Link></li>
            <li><Link to="/recipes?category=Dessert" className="hover:text-white transition-colors">Dessert</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/meal-planner" className="hover:text-white transition-colors">Meal Planner</Link></li>
            <li><Link to="/favorites" className="hover:text-white transition-colors">Favorites</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">About</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        © {new Date().getFullYear()} FoodJoy. All rights reserved.
      </div>
    </footer>
  )
}