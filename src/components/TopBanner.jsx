import './TopBanner.css';

const ALERT_ITEMS = [
  "Party Launch · Volume 1, Edition 1",
  "Filed under: General Disgruntlement",
  "Sponsored by no one. Funded by the swarm.",
  "HQ: Wherever the wifi works",
  "Now accepting rants, retweets, and resentment"
];

export default function TopBanner() {
  return (
    <div className="top-banner bg-ink text-paper">
      <div className="top-banner-overflow">
        <div className="marquee-track top-banner-track">
          {/* We repeat the items twice to ensure a smooth infinite loop */}
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
