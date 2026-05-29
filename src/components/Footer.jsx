
export default function Footer() {
  return (
    <footer style={{ background: 'var(--neutral-900)', color: 'var(--neutral-300)' }}>
      <div className="border-t py-4 text-center text-xs" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        © {new Date().getFullYear()} FoodJoy. All rights reserved.
      </div>
    </footer>
  )
}