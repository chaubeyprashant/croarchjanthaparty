import { Link } from 'react-router-dom'
import { ProtestRegisterForm } from './ProtestRegisterForm.jsx'
import { OCT10_CAMPAIGN } from '../lib/campaign.js'
import './MarchJoinModal.css'

export function MarchJoinModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="march-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="march-modal-content bg-paper border-ink"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="march-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="condensed">{OCT10_CAMPAIGN.headline}</h2>
        <p className="march-modal-sub" style={{ marginBottom: '1rem' }}>
          {OCT10_CAMPAIGN.venue} · {OCT10_CAMPAIGN.timing}
        </p>
        <ProtestRegisterForm compact onSuccess={() => {}} />
        <p className="march-modal-sub" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Prefer the full page?{' '}
          <Link to="/protests" onClick={onClose}>
            Open protests page
          </Link>
        </p>
      </div>
    </div>
  )
}
