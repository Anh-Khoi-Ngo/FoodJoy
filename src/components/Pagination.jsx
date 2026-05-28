export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) pages.push(i)

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
        style={{ border: '1px solid var(--neutral-300)', color: 'var(--neutral-600)' }}
      >
        Prev
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="w-9 h-9 rounded-lg text-sm font-medium"
          style={{
            background: p === currentPage ? 'var(--primary-red)' : 'transparent',
            color: p === currentPage ? '#fff' : 'var(--neutral-600)',
            border: p === currentPage ? 'none' : '1px solid var(--neutral-300)',
          }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
        style={{ border: '1px solid var(--neutral-300)', color: 'var(--neutral-600)' }}
      >
        Next
      </button>
    </nav>
  )
}