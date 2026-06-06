export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  function getPageNumbers() {
    const pages = []
    const siblings = 2 // pages to show on each side of current

    pages.push(1)

    const start = Math.max(2, currentPage - siblings)
    const end = Math.min(totalPages - 1, currentPage + siblings)

    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push('...')

    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const pages = getPageNumbers()

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Pagination">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-(--neutral-200)"
        style={{ color: currentPage === 1 ? 'var(--neutral-300)' : 'var(--neutral-600)' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm" style={{ color: 'var(--neutral-600)' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="w-10 h-10 rounded-lg text-sm font-medium transition-all duration-150"
            style={{
              background: p === currentPage ? 'var(--primary-red)' : 'transparent',
              color: p === currentPage ? '#fff' : 'var(--neutral-600)',
              border: p === currentPage ? '2px solid var(--primary-red)' : '1px solid var(--neutral-300)',
              boxShadow: p === currentPage ? '0 2px 8px rgba(230,57,70,0.25)' : 'none',
            }}
            onMouseEnter={e => {
              if (p !== currentPage) {
                e.currentTarget.style.background = 'var(--neutral-200)'
              }
            }}
            onMouseLeave={e => {
              if (p !== currentPage) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-(--neutral-200)"
        style={{ color: currentPage === totalPages ? 'var(--neutral-300)' : 'var(--neutral-600)' }}
      >
        Next
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </nav>
  )
}