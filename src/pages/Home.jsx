import { useState } from 'react';
import MemberFeed from '../components/MemberFeed';
import { MarchJoinModal } from '../components/MarchJoinModal.jsx';
import './Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
  const [isMarchModalOpen, setIsMarchModalOpen] = useState(false);
  return (
    <div className="home-page">
      <MemberFeed />
      
      <div className="campaign-banner bg-gold text-ink">
        <div className="campaign-banner-container">
          <div className="campaign-banner-content">
            <h2 className="condensed">20 JULY: MARCH TO PARLIAMENT</h2>
            <p>Standing in solidarity with Sonam Wangchuk for Ladakh's rights.</p>
          </div>
          <button onClick={() => setIsMarchModalOpen(true)} className="btn-campaign condensed bg-ink text-paper" style={{ cursor: 'pointer' }}>JOIN THE MOVEMENT</button>
        </div>
      </div>
      
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title font-bowlby">
              <span className="block">THE SYSTEM</span>
              <span className="block">IS BROKEN.</span>
              <span className="block text-gold">JOIN THE SWARM.</span>
            </h1>
            <p className="hero-subtitle font-serif-dev">
              For the overqualified, underemployed, and politically frustrated youth of India. 
              Main bhi Cockroach.
            </p>
            <div className="hero-actions">
              <Link to="/join" className="btn-hero-primary condensed">JOIN THE PARTY</Link>
              <a href="#manifesto" className="btn-hero-secondary condensed">READ MANIFESTO</a>
            </div>
          </div>
          <div className="hero-image-wrapper">
            {/* Using a solid block placeholder, but ideally you'd place actual images here */}
            <div className="hero-image-placeholder">
              <div className="cockroach-large">🪳</div>
            </div>
          </div>
        </div>
      </section>

      <section id="vision" className="vision-section bg-ink text-paper">
        <div className="vision-container">
          <h2 className="section-title condensed text-gold">THE VISION</h2>
          <div className="vision-grid">
            <div className="vision-card">
              <h3 className="condensed">1. Reclaim the Insult</h3>
              <p>They called us cockroaches. We embraced it. We are the resilient majority that survives every crisis, only to be ignored when the dust settles.</p>
            </div>
            <div className="vision-card">
              <h3 className="condensed">2. Political Satire</h3>
              <p>When the reality of Indian politics is a joke, the only serious response is satire. We mock the system because crying hasn't worked.</p>
            </div>
            <div className="vision-card">
              <h3 className="condensed">3. Real Demands</h3>
              <p>Behind the satire lies genuine anger and five non-negotiable demands that address the root rot in our political, judicial, and economic structures.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="manifesto" className="manifesto-section">
        <div className="manifesto-container">
          <div className="manifesto-header">
            <h2 className="section-title condensed">THE MANIFESTO</h2>
            <p className="manifesto-subtitle">Five demands. Non-negotiable.</p>
          </div>
          <div className="manifesto-list">
            <div className="manifesto-item">
              <div className="manifesto-number font-bowlby text-gold">1</div>
              <div className="manifesto-content">
                <h3>No Post-Retirement Jobs for Judges</h3>
                <p>No Rajya Sabha seats, tribunal headships, or governor posts for retiring Supreme Court or High Court judges.</p>
              </div>
            </div>
            <div className="manifesto-item">
              <div className="manifesto-number font-bowlby text-gold">2</div>
              <div className="manifesto-content">
                <h3>Voter Deletion is a Crime</h3>
                <p>Criminal liability under UAPA for any deleted legitimate vote. Protect the electoral roll.</p>
              </div>
            </div>
            <div className="manifesto-item">
              <div className="manifesto-number font-bowlby text-gold">3</div>
              <div className="manifesto-content">
                <h3>50% Women's Reservation</h3>
                <p>Immediate implementation in Parliament and Cabinet, without expanding the total seat count.</p>
              </div>
            </div>
            <div className="manifesto-item">
              <div className="manifesto-number font-bowlby text-gold">4</div>
              <div className="manifesto-content">
                <h3>Break Media Monopolies</h3>
                <p>Cancellation of broadcast licences for media houses owned by corporate monopolies.</p>
              </div>
            </div>
            <div className="manifesto-item">
              <div className="manifesto-number font-bowlby text-gold">5</div>
              <div className="manifesto-content">
                <h3>20-Year Ban for Defectors</h3>
                <p>A twenty-year bar on defecting MLAs/MPs from contesting elections or holding any public office.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarchJoinModal isOpen={isMarchModalOpen} onClose={() => setIsMarchModalOpen(false)} />
    </div>
  );
}
