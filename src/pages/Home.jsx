import { useState } from 'react'
import MemberFeed from '../components/MemberFeed'
import { MarchJoinModal } from '../components/MarchJoinModal.jsx'
import { Seo } from '../components/Seo.jsx'
import { CJP_DEMANDS, OCT10_CAMPAIGN } from '../lib/campaign.js'
import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS } from '../lib/site.js'
import {
  breadcrumbJsonLd,
  homeFaqJsonLd,
  HOME_FAQS,
  organizationJsonLd,
  protestEventJsonLd,
  websiteJsonLd,
} from '../lib/seo-schema.js'
import './Home.css'
import { Link } from 'react-router-dom'

export default function Home() {
  const [isMarchModalOpen, setIsMarchModalOpen] = useState(false)
  return (
    <div className="home-page">
      <Seo
        description={DEFAULT_DESCRIPTION}
        keywords={DEFAULT_KEYWORDS}
        canonicalPath="/"
        jsonLd={[
          organizationJsonLd(),
          websiteJsonLd(),
          protestEventJsonLd(),
          homeFaqJsonLd(),
          breadcrumbJsonLd([{ name: 'Home', path: '/' }]),
        ]}
      />
      <MemberFeed />

      <div className="campaign-banner bg-gold text-ink">
        <div className="campaign-banner-container">
          <div className="campaign-banner-content">
            <h2 className="condensed">{OCT10_CAMPAIGN.headline}</h2>
            <p>
              {OCT10_CAMPAIGN.venue} · {OCT10_CAMPAIGN.timing}. Stand for CJP’s five demands.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => setIsMarchModalOpen(true)}
              className="btn-campaign condensed bg-ink text-paper"
              style={{ cursor: 'pointer' }}
            >
              REGISTER NOW
            </button>
            <Link to="/protests" className="btn-campaign condensed bg-paper text-ink border-ink">
              FULL DETAILS →
            </Link>
          </div>
        </div>
      </div>

      <div className="brutality-report-banner bg-ink text-paper">
        <div className="brutality-report-container">
          <div className="brutality-report-content">
            <h2 className="condensed text-gold">REPORT POLICE BRUTALITY</h2>
            <p>
              Beaten, molested, or mistreated by police? File a complaint with photo/video proof —
              plus your name, phone, email, and Instagram/Facebook for private follow-up.
            </p>
            <p className="text-gold" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Your contact stays private. We verify and escalate with evidence.
            </p>
          </div>
          <Link to="/complaints/new?focus=police" className="btn-report condensed bg-gold text-ink">
            SUBMIT PROOF
          </Link>
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
            <p className="hero-kicker condensed">
              Cockroach Janta Party · 10 Oct Jantar Mantar · Main Bhi Cockroach
            </p>
            <p className="hero-subtitle font-serif-dev">
              For the overqualified, underemployed, and politically frustrated youth of India.
              Register for the 10 October protest, stand for CJP’s five demands, and report police
              brutality with proof. Main bhi Cockroach.
            </p>
            <div className="hero-actions">
              <Link to="/protests" className="btn-hero-primary condensed">
                10 OCT PROTEST →
              </Link>
              <a href="#manifesto" className="btn-hero-secondary condensed">
                READ MANIFESTO
              </a>
            </div>
          </div>
          <div className="hero-image-wrapper">
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
              <p>
                They called us cockroaches. We embraced it. We are the resilient majority that
                survives every crisis, only to be ignored when the dust settles.
              </p>
            </div>
            <div className="vision-card">
              <h3 className="condensed">2. Political Satire</h3>
              <p>
                When the reality of Indian politics is a joke, the only serious response is satire.
                We mock the system because crying hasn&apos;t worked.
              </p>
            </div>
            <div className="vision-card">
              <h3 className="condensed">3. Real Demands</h3>
              <p>
                Behind the satire lies genuine anger and five non-negotiable demands that address
                the root rot in our political, judicial, and economic structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="manifesto" className="manifesto-section">
        <div className="manifesto-container">
          <div className="manifesto-header">
            <h2 className="section-title condensed">THE MANIFESTO</h2>
            <p className="manifesto-subtitle">Five demands. Non-negotiable. Same as CJP.</p>
          </div>
          <div className="manifesto-list">
            {CJP_DEMANDS.map((demand) => (
              <div className="manifesto-item" key={demand.number}>
                <div className="manifesto-number font-bowlby text-gold">{demand.number}</div>
                <div className="manifesto-content">
                  <h3>{demand.title}</h3>
                  <p>{demand.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="faq-section bg-paper-soft">
        <div className="faq-container">
          <h2 className="section-title condensed">FREQUENTLY ASKED</h2>
          <p className="faq-intro">
            Quick answers about Cockroach Janta Party, the 10 October Jantar Mantar protest, and
            police brutality complaints.
          </p>
          <div className="faq-list">
            {HOME_FAQS.map((item) => (
              <details key={item.question} className="faq-item">
                <summary className="condensed">{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="faq-actions">
            <Link to="/protests" className="btn-campaign condensed bg-ink text-paper">
              REGISTER 10 OCT →
            </Link>
            <Link to="/complaints/new?focus=police" className="btn-campaign condensed bg-gold text-ink">
              REPORT POLICE BRUTALITY →
            </Link>
          </div>
        </div>
      </section>

      <MarchJoinModal isOpen={isMarchModalOpen} onClose={() => setIsMarchModalOpen(false)} />
    </div>
  )
}
