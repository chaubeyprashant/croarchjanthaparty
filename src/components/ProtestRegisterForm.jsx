import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../context/auth-context.js'
import { db, isFirebaseConfigured } from '../lib/firebase.js'
import { OCT10_CAMPAIGN } from '../lib/campaign.js'

export function ProtestRegisterForm({ onSuccess, compact = false }) {
  const { user, isAuthenticated, updateProfile } = useAuth()
  const hasExistingPhone = Boolean(user?.phone)
  const [phone, setPhone] = useState(user?.phone || '')
  const [city, setCity] = useState(user?.city || '')
  const [joinMode, setJoinMode] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isFirebaseConfigured || !db) {
      setStatus({ type: 'error', message: 'Firebase is not configured. Please try again later.' })
      return
    }

    const finalPhone = hasExistingPhone ? user.phone : phone
    if (!finalPhone || (typeof finalPhone === 'string' && !finalPhone.trim())) {
      setStatus({ type: 'error', message: 'Please enter a valid WhatsApp number.' })
      return
    }
    if (!joinMode) {
      setStatus({ type: 'error', message: 'Please select how you will join.' })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      if (!hasExistingPhone) {
        await updateProfile(user.id, { phone: String(finalPhone).trim() })
      }

      await addDoc(collection(db, OCT10_CAMPAIGN.collection), {
        userId: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: String(finalPhone).trim(),
        city: String(city || '').trim(),
        joinMode,
        venue: OCT10_CAMPAIGN.venue,
        eventDate: OCT10_CAMPAIGN.eventDate,
        campaign: 'oct10-jantar-mantar',
        joinedAt: serverTimestamp(),
      })

      const message =
        joinMode === 'delhi'
          ? 'Registered. See you at Jantar Mantar — 24/7 peaceful presence.'
          : 'Registered for virtual solidarity. We will share WhatsApp updates soon.'
      setStatus({ type: 'success', message })
      onSuccess?.()
      if (!hasExistingPhone) setPhone('')
    } catch (error) {
      console.error(error)
      setStatus({ type: 'error', message: 'Failed to register. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="march-modal-login-prompt">
        <p style={{ opacity: 0.8 }}>
          Log in to register for the 10 October protest at Jantar Mantar.
        </p>
        <Link to="/login" className="btn-campaign condensed bg-ink text-paper">
          LOG IN TO REGISTER
        </Link>
        <Link to="/join" className="link" style={{ marginTop: '0.5rem' }}>
          New here? Create an account
        </Link>
      </div>
    )
  }

  return (
    <form className="march-modal-form" onSubmit={handleSubmit}>
      {!compact && (
        <p className="march-modal-sub">
          <strong>{OCT10_CAMPAIGN.venue}</strong>
          <br />
          Timing: {OCT10_CAMPAIGN.timing}
        </p>
      )}

      {hasExistingPhone ? (
        <p className="march-modal-sub">
          We have your phone ({user.phone}) on file. Confirm how you will join on 10 October.
        </p>
      ) : (
        <label>
          WhatsApp Number
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Your WhatsApp number"
            required
          />
        </label>
      )}

      <label>
        City (optional)
        <input
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Your city"
        />
      </label>

      <label>
        How will you join?
        <select
          value={joinMode}
          onChange={(event) => setJoinMode(event.target.value)}
          required
          style={{
            padding: '0.75rem 1rem',
            border: '2px solid var(--ink)',
            borderRadius: '0.25rem',
            fontFamily: 'inherit',
            fontSize: '1rem',
            backgroundColor: 'var(--paper-soft)',
          }}
        >
          <option value="">Select an option</option>
          <option value="delhi">I will be at Jantar Mantar, Delhi</option>
          <option value="virtually">I will join virtually / online</option>
        </select>
      </label>

      {status.message && (
        <p className={`march-modal-status ${status.type}`}>{status.message}</p>
      )}

      {(!status.message || status.type === 'error') && (
        <button
          type="submit"
          className="btn-campaign condensed bg-ink text-paper"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'SUBMITTING...' : 'REGISTER FOR 10 OCT'}
        </button>
      )}
    </form>
  )
}
