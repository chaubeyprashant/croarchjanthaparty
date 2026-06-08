import { useEffect, useMemo, useState } from 'react'
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../context/auth-context.js'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'
import { db, firebaseConfigError, isFirebaseConfigured, normalizeDate } from '../lib/firebase.js'

const TIERS = [
  { amount: 250, label: 'Chai & Rant', tag: 'Funds a meme designer for a day.' },
  { amount: 750, label: 'Volunteer Kit', tag: 'Pamphlets, posters, and a sturdy spine.' },
  { amount: 2100, label: 'District Drive', tag: 'A local mobilization in one ward.' },
  { amount: 5100, label: 'Swarm Surge', tag: 'Outreach across an entire city.' },
]

const ALLOCATION = [
  { label: 'Grassroots organizing', share: 0.45, color: 'var(--orange)' },
  { label: 'Independent journalism grants', share: 0.25, color: 'var(--green)' },
  { label: 'Volunteer reimbursements', share: 0.15, color: 'var(--brown)' },
  { label: 'Legal & compliance', share: 0.1, color: 'var(--brown-dark)' },
  { label: 'Server bills (wifi, you see)', share: 0.05, color: '#888' },
]

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function Donate() {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [backendError, setBackendError] = useState(() =>
    isFirebaseConfigured ? '' : firebaseConfigError(),
  )
  const [selectedTier, setSelectedTier] = useState(750)
  const [customAmount, setCustomAmount] = useState('')
  const [donor, setDonor] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    pan: '',
    message: '',
    method: 'upi',
    recurring: false,
  }))
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return undefined
    const donationsQuery = query(collection(db, 'donations'), orderBy('createdAt', 'desc'), limit(100))
    return onSnapshot(
      donationsQuery,
      (snapshot) => {
        const records = snapshot.docs.map((docSnap) => {
          const data = docSnap.data()
          return {
            id: docSnap.id,
            amount: data.amount || 0,
            donor: data.donor || 'Anonymous',
            email: data.email || '',
            method: data.method || 'upi',
            recurring: Boolean(data.recurring),
            message: data.message || '',
            createdAt: normalizeDate(data.createdAt) || new Date().toISOString(),
          }
        })
        setDonations(records)
        setBackendError('')
      },
      () => {
        setBackendError('Unable to load donations from Firebase.')
      },
    )
  }, [])

  const activeAmount = useMemo(() => {
    if (customAmount) return Number(customAmount) || 0
    return selectedTier
  }, [customAmount, selectedTier])

  const totals = useMemo(() => {
    const total = donations.reduce((acc, item) => acc + item.amount, 0)
    return {
      total,
      count: donations.length,
      avg: donations.length ? Math.round(total / donations.length) : 0,
    }
  }, [donations])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setDonor((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!activeAmount || activeAmount <= 0 || !isFirebaseConfigured || !db) return
    const record = {
      amount: activeAmount,
      donor: donor.name,
      email: donor.email,
      method: donor.method,
      recurring: donor.recurring,
      message: donor.message,
      userId: user?.id || null,
      createdAt: serverTimestamp(),
    }
    try {
      await addDoc(collection(db, 'donations'), record)
      setConfirmation({
        ...record,
        createdAt: new Date().toISOString(),
      })
      setCustomAmount('')
      setDonor((current) => ({ ...current, message: '' }))
      window.setTimeout(() => setConfirmation(null), 6000)
      setBackendError('')
    } catch {
      setBackendError('Unable to submit donation right now. Please try again.')
    }
  }

  return (
    <>
      <Seo
        title="Donate"
        description="Support Cockroach Janta Party with transparent grassroots donations. Choose a tier, track allocation, and fund independent community-led action."
        keywords="donate, political donations India, grassroots funding, transparent donations, Cockroach Janta Party"
        canonicalPath="/donate"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'DonateAction',
          name: 'Donate to Cockroach Janta Party',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://cockroachjanthaparty.com/donate',
          },
        }}
      />
      <section className="section page-head">
        <Reveal as="p" className="eyebrow">
          Donations
        </Reveal>
        <Reveal as="h1" delay={60}>
          Fund the <em className="accent-orange">swarm.</em>
        </Reveal>
        <Reveal as="p" className="lead" delay={120}>
          We take zero corporate money. Every rupee is logged, allocated, and accounted for —
          publicly. If you can give chai-money, give chai-money. If you can&apos;t, donate your
          rage instead.
        </Reveal>
      </section>

      <section className="section donate-grid">
        <Reveal as="form" className="donate-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Pick a tier</legend>
            <div className="tier-grid">
              {TIERS.map((tier) => {
                const isActive = !customAmount && selectedTier === tier.amount
                return (
                  <button
                    type="button"
                    key={tier.amount}
                    className={`tier ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setCustomAmount('')
                      setSelectedTier(tier.amount)
                    }}
                  >
                    <strong>{formatCurrency(tier.amount)}</strong>
                    <span className="tier-label">{tier.label}</span>
                    <span className="tier-tag">{tier.tag}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <label className="custom-amount">
            Or enter a custom amount
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              placeholder="₹"
            />
          </label>

          <div className="donor-grid">
            <label>
              Full name
              <input
                type="text"
                name="name"
                required
                value={donor.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                required
                value={donor.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </label>
            <label>
              PAN (for 80G receipt)
              <input
                type="text"
                name="pan"
                value={donor.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
              />
            </label>
            <label>
              Payment method
              <select name="method" value={donor.method} onChange={handleChange}>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="netbanking">Netbanking</option>
              </select>
            </label>
          </div>

          <label>
            Add a message (optional)
            <textarea
              name="message"
              rows="3"
              value={donor.message}
              onChange={handleChange}
              placeholder="A note for the team..."
            />
          </label>

          <label className="recurring-row">
            <input
              type="checkbox"
              name="recurring"
              checked={donor.recurring}
              onChange={handleChange}
            />
            Make this a monthly recurring donation
          </label>

          <div className="donate-cta">
            <button type="submit" className="btn btn-primary" disabled={activeAmount <= 0}>
              Donate {formatCurrency(activeAmount || 0)} →
            </button>
            <p className="security-note">
              🔒 Connected to Firebase Firestore. Add a payment gateway webhook before production.
            </p>
            {backendError && <p className="auth-error">{backendError}</p>}
          </div>

          {confirmation && (
            <div className="confirmation" role="status">
              <strong>Thank you, {confirmation.donor}.</strong>
              <p>
                {formatCurrency(confirmation.amount)} logged. Receipt sent to{' '}
                <em>{confirmation.email}</em>.
              </p>
            </div>
          )}
        </Reveal>

        <aside className="donate-side">
          <Reveal className="impact-card">
            <h3>Where your rupee goes</h3>
            <div className="allocation-bar" aria-hidden="true">
              {ALLOCATION.map((slice) => (
                <span
                  key={slice.label}
                  style={{ width: `${slice.share * 100}%`, background: slice.color }}
                />
              ))}
            </div>
            <ul className="allocation-list">
              {ALLOCATION.map((slice) => (
                <li key={slice.label}>
                  <span className="swatch" style={{ background: slice.color }} aria-hidden="true" />
                  <span>{slice.label}</span>
                  <strong>{Math.round(slice.share * 100)}%</strong>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="ledger-card" delay={80}>
            <h3>Live ledger</h3>
            <div className="ledger-stats">
              <div>
                <strong>{formatCurrency(totals.total)}</strong>
                <span>raised on this device</span>
              </div>
              <div>
                <strong>{totals.count}</strong>
                <span>donations</span>
              </div>
              <div>
                <strong>{formatCurrency(totals.avg)}</strong>
                <span>average gift</span>
              </div>
            </div>
            {donations.length > 0 ? (
              <ul className="ledger-list">
                {donations.slice(0, 5).map((entry) => (
                  <li key={entry.id}>
                    <span>{entry.donor || 'Anonymous'}</span>
                    <strong>{formatCurrency(entry.amount)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ledger-empty">No donations yet. Be the first roach in the box.</p>
            )}
          </Reveal>

          <Reveal className="badge-card" delay={160}>
            <p className="badge"><span className="pulse" /> Transparency report</p>
            <h3>Published quarterly.</h3>
            <p>
              Bank account audit, vendor list, and every reimbursement above ₹1,000 is published on
              our public ledger.
            </p>
          </Reveal>
        </aside>
      </section>
    </>
  )
}
