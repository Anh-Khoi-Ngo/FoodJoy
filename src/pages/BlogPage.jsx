import { Link } from 'react-router-dom'
import blogArticles from '../data/blogArticles'
import AdBanner from '../components/AdBanner'

export default function BlogPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--neutral-900)' }}>Blog</h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--neutral-600)' }}>Tips, recipes, and ideas to make cooking easier and more enjoyable.</p>

      <AdBanner position="top" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogArticles.map(article => (
          <Link
            key={article.slug}
            to={`/blog/${article.slug}`}
            className="card-hover rounded-xl overflow-hidden bg-white block"
            style={{ border: '1px solid var(--neutral-300)' }}
          >
            <div className="h-48 overflow-hidden">
              <img src={article.image} alt={article.title} className="img-rounded" />
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--primary-red)' }}>
                {article.category}
              </span>
              <h2 className="text-lg font-semibold mt-1" style={{ color: 'var(--neutral-900)' }}>
                {article.title}
              </h2>
              <p className="text-sm mt-2" style={{ color: 'var(--neutral-600)' }}>{article.excerpt}</p>
              <div className="flex items-center justify-between mt-3 text-xs" style={{ color: 'var(--neutral-600)' }}>
                <span>{article.author}</span>
                <span>{article.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <AdBanner position="bottom" />
    </main>
  )
}