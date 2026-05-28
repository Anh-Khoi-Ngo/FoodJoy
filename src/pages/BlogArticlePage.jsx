import { useParams, Link } from 'react-router-dom'
import blogArticles from '../data/blogArticles'
import AdBanner from '../components/AdBanner'

export default function BlogArticlePage() {
  const { slug } = useParams()
  const article = blogArticles.find(a => a.slug === slug)

  if (!article) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12 text-center" style={{ color: 'var(--neutral-600)' }}>
        <p>Article not found.</p>
        <Link to="/blog" className="underline mt-4 inline-block" style={{ color: 'var(--primary-red)' }}>Back to Blog</Link>
      </main>
    )
  }

  const paragraphs = article.content.split('\n').filter(p => p.trim())
  const html = paragraphs.map(p => {
    if (p.startsWith('## ')) return `<h2 style="color:var(--neutral-900);font-size:1.5rem;font-weight:700;margin-top:2rem;margin-bottom:0.5rem">${p.slice(3)}</h2>`
    if (p.startsWith('### ')) return `<h3 style="color:var(--neutral-900);font-size:1.25rem;font-weight:600;margin-top:1.5rem;margin-bottom:0.5rem">${p.slice(4)}</h3>`
    if (p.startsWith('**Tip:**')) return `<p style="background:var(--neutral-200);padding:1rem;border-radius:8px;margin-top:1rem"><strong>${p}</strong></p>`
    if (p.startsWith('- ')) return `<li style="margin-left:1.5rem;margin-bottom:0.25rem;color:var(--neutral-900)">${p.slice(2)}</li>`
    if (p.startsWith('---')) return `<hr style="border:none;border-top:1px solid var(--neutral-300);margin:2rem 0" />`
    if (p.startsWith('|')) return null // skip table rows
    return `<p style="color:var(--neutral-900);line-height:1.75;margin-bottom:0.75rem">${p}</p>`
  }).filter(Boolean).join('\n')

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/blog" className="text-sm mb-6 inline-block" style={{ color: 'var(--primary-red)' }}>← Back to Blog</Link>

      <article>
        <img src={article.image} alt={article.title} className="w-full h-64 sm:h-80 object-cover rounded-xl mb-6" style={{ boxShadow: 'var(--shadow-medium)' }} />

        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--primary-red)' }}>{article.category}</span>
        <h1 className="text-3xl font-bold mt-1" style={{ color: 'var(--neutral-900)' }}>{article.title}</h1>
        <div className="flex items-center gap-3 mt-2 text-sm" style={{ color: 'var(--neutral-600)' }}>
          <span>{article.author}</span>
          <span>•</span>
          <time>{article.date}</time>
        </div>

        <AdBanner position="top" />

        <div className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: html }} />

        <AdBanner position="mid" />

        <div className="mt-10 p-6 rounded-xl" style={{ background: 'var(--neutral-200)' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--neutral-900)' }}>Enjoyed this article?</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--neutral-600)' }}>Share it with friends and explore more recipes on FoodJoy.</p>
          <Link to="/recipes" className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary-red)' }}>Browse Recipes</Link>
        </div>

        <AdBanner position="bottom" />
      </article>
    </main>
  )
}