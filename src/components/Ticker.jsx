const items = [
  '★ 2,04,000+ COCKROACHES REGISTERED',
  'SECULAR · SOCIALIST · DEMOCRATIC · LAZY',
  'ZERO SPONSORS · ZERO DAVOS TRIPS · ZERO PM CARES',
  'MAIN BHI COCKROACH — मैं भी कॉकरोच',
  'YOU CANNOT SQUASH A MOVEMENT',
  'TOGETHER WE SURVIVE',
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
