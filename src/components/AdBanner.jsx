export default function AdBanner({ position = 'left', className = '' }) {
  const isSide = position === 'left' || position === 'right'

  return (
    <div
      className={`rounded-lg flex items-center justify-center text-sm shrink-0 ${className}`}
      style={{
        background: 'var(--neutral-200)',
        border: '1px dashed var(--neutral-300)',
        color: 'var(--neutral-600)',
        minHeight: isSide ? 300 : 90,
        width: isSide ? 160 : '100%',
      }}
      role="complementary"
      aria-label={`Advertisement ${position}`}
    >
      <span className={isSide ? 'writing-mode-vertical' : ''}>
        AdSense Ad ({position})
      </span>
    </div>
  )
}