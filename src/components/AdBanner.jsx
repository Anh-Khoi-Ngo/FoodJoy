export default function AdBanner({ position = 'top', className = '' }) {
  return (
    <div
      className={`w-full rounded-lg flex items-center justify-center text-sm my-6 ${className}`}
      style={{
        background: 'var(--neutral-200)',
        border: '1px dashed var(--neutral-300)',
        color: 'var(--neutral-600)',
        minHeight: 90,
      }}
      role="complementary"
      aria-label={`Advertisement ${position}`}
    >
      {/* Replace this placeholder with your AdSense code */}
      <span>AdSense Ad ({position})</span>
    </div>
  )
}