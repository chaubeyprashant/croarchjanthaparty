import './TopBanner.css';

const ALERT_ITEMS = [
  '10 OCT · JANTAR MANTAR · 24/7 · REGISTER NOW',
  'CJP FIVE DEMANDS · ZERO SPONSORS · MAIN BHI COCKROACH',
  'REPORT POLICE BRUTALITY · PHOTO / VIDEO PROOF',
  'CEC ACCOUNTABILITY · YOUTH UNEMPLOYMENT · EDUCATION REFORM',
  'JOIN THE SWARM · कॉकरोच जनता पार्टी',
];

export default function TopBanner() {
  return (
    <div className="top-banner bg-ink text-paper">
      <div className="top-banner-overflow">
        <div className="marquee-track top-banner-track">
          {[...ALERT_ITEMS, ...ALERT_ITEMS].map((item, index) => (
            <span key={index} className="top-banner-item condensed">
              <span className="text-gold">✦</span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
