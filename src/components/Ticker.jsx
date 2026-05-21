const items = [
  'GENERAL DISGRUNTLEMENT',
  'SPONSORED BY NO ONE · FUNDED BY NOTHING',
  'HQ WHEREVER THE WIFI WORKS',
  'TOGETHER · RESILIENT · UNSTOPPABLE',
]

export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  )
}
