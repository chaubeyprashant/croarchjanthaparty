import './MemberFeed.css';

const MOCK_MEMBERS = [
  { initials: 'SK', name: 'Sharmin Muzaffar Khan', loc: 'Mumbai, MH', color: '#C9A227', text: '#1A1108' },
  { initials: 'SN', name: 'Shivani Nagar', loc: 'harda, MP', color: '#1A1108', text: '#F4EBD7' },
  { initials: 'AA', name: 'Anay Agarwal', loc: 'kanpur, UP', color: '#C9A227', text: '#1A1108' },
  { initials: 'NS', name: 'Nitesh Sharma', loc: 'Baghpat, UP', color: '#1A1108', text: '#F4EBD7' },
  { initials: 'JS', name: 'JAGJEET SINGH', loc: 'Shahabad Markanda, HR', color: '#C9A227', text: '#1A1108' },
  { initials: 'VS', name: 'VARUN SHARMA', loc: 'Gwalior, MP', color: '#1A1108', text: '#F4EBD7' },
  { initials: 'AA', name: 'Apeksha Avinash', loc: 'Mysuru, KA', color: '#C9A227', text: '#1A1108' },
  { initials: 'AK', name: 'akshay kumar', loc: 'DEHERADUN, UK', color: '#1A1108', text: '#F4EBD7' },
  { initials: 'SK', name: 'Shaurya Kaushik', loc: 'Bhiwadi, RJ', color: '#C9A227', text: '#1A1108' },
  { initials: 'PP', name: 'Prachikta Pradhan', loc: 'Sambalpur, OD', color: '#1A1108', text: '#F4EBD7' },
];

export default function MemberFeed() {
  return (
    <div className="member-feed bg-paper-soft" role="region" aria-label="Latest members of The Cockroach Janta Party">
      <div className="member-fade-left"></div>
      <div className="member-fade-right"></div>
      <div className="live-indicator">
        <span className="live-dot"></span>
        <span className="live-text condensed">Live · Joining now</span>
      </div>
      
      <div className="marquee-track member-track">
        {[...MOCK_MEMBERS, ...MOCK_MEMBERS, ...MOCK_MEMBERS].map((member, i) => (
          <span key={i} className="member-card bg-paper">
            <div className="member-avatar" style={{ backgroundColor: member.color, borderColor: member.text === '#1A1108' ? '#1A1108' : '#F4EBD7' }}>
              <span className="member-initials condensed" style={{ color: member.text }}>{member.initials}</span>
            </div>
            <span className="member-info">
              <span className="member-name text-ink">{member.name}</span>
              <span className="member-loc condensed text-ink-muted">{member.loc}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
