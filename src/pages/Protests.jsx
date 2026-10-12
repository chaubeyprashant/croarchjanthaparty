import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo.jsx'
import { MarchJoinModal } from '../components/MarchJoinModal.jsx'
import { ProtestRegisterForm } from '../components/ProtestRegisterForm.jsx'
import { CJP_DEMANDS, OCT10_CAMPAIGN } from '../lib/campaign.js'
import { DEFAULT_KEYWORDS, PROTEST_KEYWORDS } from '../lib/site.js'
import { breadcrumbJsonLd, protestEventJsonLd } from '../lib/seo-schema.js'
import './Protests.css'

export function Protests() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Seo
        title="CJP Protest Registration — Jantar Mantar 24/7"
        description="Join the Cockroach Janta Party protest at Jantar Mantar, New Delhi. 24/7 peaceful presence. Join in person or virtually. Stand for CJP’s five demands and CEC accountability."
        keywords={`${PROTEST_KEYWORDS}, ${DEFAULT_KEYWORDS}`}
        canonicalPath="/protests"
        jsonLd={[
          protestEventJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Join Protest', path: '/protests' },
          ]),
        ]}
      />

      <div className="protests-page">
        <section className="protests-hero bg-ink text-paper">
          <div className="protests-container">
            <p className="protests-eyebrow text-gold condensed">LIVE CAMPAIGN · JANTAR MANTAR</p>
            <h1 className="protests-title font-bowlby">
              JANTAR MANTAR.
              <br />
              <span className="text-gold">24/7.</span>
              <br />
              REGISTER NOW.
            </h1>
            <p className="protests-lead">
              {OCT10_CAMPAIGN.subhead}
            </p>
            <div className="protests-meta">
              <div>
                <span className="condensed text-gold">WHEN</span>
                <strong>{OCT10_CAMPAIGN.eventDateLabel} · 24/7</strong>
              </div>
              <div>
                <span className="condensed text-gold">WHERE</span>
                <strong>{OCT10_CAMPAIGN.venue}</strong>
              </div>
              <div>
                <span className="condensed text-gold">HOW</span>
                <strong>In person or virtually</strong>
              </div>
            </div>
            <div className="protests-actions">
              <a href="#register" className="btn-campaign condensed bg-gold text-ink">
                {OCT10_CAMPAIGN.ctaPrimary}
              </a>
              <button
                type="button"
                className="btn-campaign condensed bg-paper text-ink"
                onClick={() => setIsModalOpen(true)}
              >
                QUICK REGISTER
              </button>
            </div>
          </div>
        </section>

        <section className="protests-section">
          <div className="protests-container">
            <h2 className="section-title condensed">OUR DEMANDS</h2>
            <p className="protests-section-sub">Same as CJP — five demands. Zero compromises.</p>
            <ol className="protests-demands">
              {CJP_DEMANDS.map((demand) => (
                <li key={demand.number} className="protests-demand-item">
                  <span className="font-bowlby text-gold">{demand.number}</span>
                  <div>
                    <h3 className="condensed">{demand.title}</h3>
                    <p>{demand.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="register" className="protests-section bg-paper-soft protests-register">
          <div className="protests-container protests-register-grid">
            <div>
              <h2 className="section-title condensed">JOIN THE PROTEST</h2>
              <p>
                Tell us if you’ll be at Jantar Mantar or joining virtually. We’ll share WhatsApp
                updates for coordination.
              </p>
              <ul className="protests-notes">
                <li>Peaceful civic assembly only.</li>
                <li>Bring water, ID, and stay with the group.</li>
                <li>
                  Faced police harassment?{' '}
                  <Link to="/complaints/new">Report evidence here</Link>.
                </li>
              </ul>
            </div>
            <div className="protests-form-card bg-paper border-ink">
              <ProtestRegisterForm />
            </div>
          </div>
        </section>

        <section className="protests-section">
          <div className="protests-container" style={{ textAlign: 'center' }}>
            <p className="protests-disclaimer">
              This is a peaceful civic mobilisation organised by supporters of the Cockroach Janta
              Party movement. Participation is voluntary. Follow local laws and police directions at
              all times.
            </p>
            <Link to="/" className="btn-campaign condensed bg-ink text-paper">
              BACK TO HOME
            </Link>
          </div>
        </section>
      </div>

      <MarchJoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default Protests
