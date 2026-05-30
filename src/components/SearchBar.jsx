export default function SearchBar({ onSearch }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        const q = e.currentTarget.query.value.trim()
        if (onSearch) onSearch(q)
      }}
      className="w-full max-w-3xl mx-auto flex items-center gap-2"
    >
      <input
        name="query"
        type="search"
        placeholder="Search recipes..."
        className="flex-1 px-4 py-3 rounded-lg border focus:outline-none"
        style={{
          borderColor: 'var(--neutral-300)',
          background: 'var(--neutral-100)',
          boxShadow: 'var(--shadow-soft)',
        }}
        aria-label="Search recipes"
        onChange={e => {
          const q = e.currentTarget.value.trim()
          if (onSearch) onSearch(q)
        }}
        onInput={e => {
          const q = e.currentTarget.value.trim()
          if (onSearch) onSearch(q)
        }}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg text-white text-sm cursor-pointer transition-all duration-150"
        style={{ background: 'var(--primary-red)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-red-dark)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--primary-red)'}
      >
        Search
      </button>
    </form>
  )
}