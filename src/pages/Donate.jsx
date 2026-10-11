import { useEffect, useState } from 'react'
import { Check, Coffee, Copy, ExternalLink, Heart, ShieldCheck, Smartphone, Sparkles } from 'lucide-react'
import { useAuth } from '../context/auth-context.js'
import { Seo } from '../components/Seo.jsx'
import { recordDevSupport, recordDonatePageVisit } from '../lib/supporters.js'
import './Donate.css'

const DOMESTIC_PRESETS = [100, 250, 500, 1000, 2000]
const INTERNATIONAL_PRESETS = [5, 10, 25, 50, 100]

export default function Donate() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('domestic')
  const [copiedUpi, setCopiedUpi] = useState(false)

  // Automatically record page visit to Firebase donate_page_visits collection
  useEffect(() => {
    recordDonatePageVisit(user)
  }, [user])

  // Form state
  const [name, setName] = useState(() => user?.name || '')
  const [email, setEmail] = useState(() => user?.email || '')
  const [phone, setPhone] = useState(() => user?.phone || '')
  const [amount, setAmount] = useState('250')
  const [method, setMethod] = useState('upi_qr')
  const [transactionId, setTransactionId] = useState('')
  const [message, setMessage] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submittedRecord, setSubmittedRecord] = useState(null)

  const upiId = 'chaubeyprashant20@ybl'
  const upiPayLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Prashant Kumar Chaubey')}&cu=INR`

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      setCopiedUpi(true)
      setTimeout(() => setCopiedUpi(false), 2500)
    } catch {
      setCopiedUpi(true)
      setTimeout(() => setCopiedUpi(false), 2500)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'international') {
      setAmount('25')
      setMethod('wise')
    } else {
      setAmount('250')
      setMethod('upi_qr')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })

    const trimmedName = name.trim()
    const numAmount = Number(amount)

    if (!trimmedName) {
      setStatus({ type: 'error', message: 'Please enter your name.' })
      return
    }

    if (!numAmount || numAmount <= 0) {
      setStatus({ type: 'error', message: 'Please enter a valid contribution amount.' })
      return
    }

    setIsSubmitting(true)

    try {
      const record = await recordDevSupport({
        name: trimmedName,
        email: email.trim(),
        phone: phone.trim(),
        amount: numAmount,
        currency: activeTab === 'international' ? 'USD' : 'INR',
        method,
        transactionId: transactionId.trim(),
        message: message.trim(),
        userId: user?.id || null,
      })

      setSubmittedRecord(record)
      setStatus({
        type: 'success',
        message: 'Thank you! Your payment record has been saved successfully.',
      })
    } catch (err) {
      console.error(err)
      setStatus({
        type: 'error',
        message: err.message || 'Failed to save payment record. Please check your connection.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setSubmittedRecord(null)
    setStatus({ type: '', message: '' })
    setTransactionId('')
    setMessage('')
  }

  return (
    <>
      <Seo
        title="Support the Developer"
        description="Voluntary contributions to the independent website developer for hosting, server maintenance, and ongoing web development."
        canonicalPath="/donate"
      />

      <div className="donate-page bg-paper text-ink">
        <div className="donate-container">
          <div className="donate-header">
            <div className="donate-badge">
              <Coffee size={15} /> DIRECT DEV SUPPORT
            </div>
            <h1 className="donate-title condensed text-gold">SUPPORT THE DEV</h1>
            <p className="donate-subtitle">
              Voluntary contributions to the independent website developer for hosting, maintenance,
              and ongoing platform development. Not affiliated with any political party,
              election campaign, trust, or NGO.
            </p>
          </div>

          <div className="donate-box">
            <div className="donate-tabs">
              <button
                className={`donate-tab condensed ${activeTab === 'domestic' ? 'active' : ''}`}
                onClick={() => handleTabChange('domestic')}
                type="button"
              >
                Domestic · UPI / QR
              </button>
              <button
                className={`donate-tab condensed ${activeTab === 'international' ? 'active' : ''}`}
                onClick={() => handleTabChange('international')}
                type="button"
              >
                International · Wise
              </button>
            </div>

            <div className="donate-content">
              {activeTab === 'domestic' ? (
                <div className="donate-domestic">
                  <h3 className="condensed text-gold">SCAN &amp; PAY VIA ANY UPI APP</h3>
                  <p>
                    Scan the QR code below using Google Pay, PhonePe, Paytm, BHIM, Cred, or any UPI app.
                  </p>

                  <div className="qr-container">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPayLink)}`}
                      alt="UPI QR Code - chaubeyprashant20@ybl"
                      className="qr-image"
                      width="250"
                      height="250"
                    />
                  </div>

                  <div className="upi-details-card">
                    <div className="upi-row">
                      <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>UPI ID:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="upi-id-badge">{upiId}</span>
                        <button
                          type="button"
                          className="btn-copy-upi"
                          onClick={handleCopyUpi}
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? (
                            <>
                              <Check size={14} /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="upi-row">
                      <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>Recipient Name:</span>
                      <strong>PRASHANT KUMAR CHAUBEY</strong>
                    </div>
                  </div>

                  <div className="payment-actions">
                    <a href={upiPayLink} className="btn-pay condensed">
                      <Smartphone size={18} /> OPEN IN UPI APP (MOBILE)
                    </a>
                  </div>
                </div>
              ) : (
                <div className="donate-international">
                  <h3 className="condensed text-gold">PAY VIA WISE</h3>
                  <p>Support our development from anywhere in the world securely using Wise.</p>

                  <div className="wise-info">
                    <p>
                      Wise (formerly TransferWise) gives you real exchange rates with zero hidden fees.
                      Click below to send a voluntary developer contribution directly.
                    </p>
                  </div>

                  <div className="payment-actions">
                    <button
                      className="btn-pay condensed"
                      type="button"
                      onClick={() =>
                        window.open(
                          'https://wise.com/pay/business/prashantchaubey?utm_source=open_link',
                          '_blank',
                        )
                      }
                    >
                      <ExternalLink size={18} /> PAY NOW WITH WISE
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="donate-disclaimer">
              <p>
                <strong>Transparency Note:</strong> Direct transfers go directly to Prashant Kumar
                Chaubey to cover server bills, database costs, and continuous open updates.
              </p>
            </div>
          </div>

          {/* Supporter Details Recording Section */}
          <div className="supporter-form-card" id="record-support">
            <div className="supporter-form-header">
              <h2 className="condensed text-gold">
                <Sparkles size={22} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
                PAID? RECORD YOUR DETAILS
              </h2>
              <p>
                Transferred via UPI, QR, or Wise? Submit your details below so the developer can
                keep a verified record of your contribution and acknowledge you.
              </p>
            </div>

            {submittedRecord ? (
              <div className="support-success-card">
                <div className="success-icon-wrap">
                  <Heart size={32} />
                </div>
                <h3 className="condensed text-gold">THANK YOU FOR YOUR SUPPORT!</h3>
                <p>
                  Your contribution has been saved in the developer&apos;s support registry. Your
                  generosity helps keep this platform independent, fast, and alive!
                </p>

                <div className="receipt-box">
                  <div className="receipt-row">
                    <span>Supporter:</span>
                    <strong>{submittedRecord.name}</strong>
                  </div>
                  {submittedRecord.email && (
                    <div className="receipt-row">
                      <span>Email:</span>
                      <span>{submittedRecord.email}</span>
                    </div>
                  )}
                  <div className="receipt-row">
                    <span>Amount:</span>
                    <strong>
                      {submittedRecord.currency === 'INR' ? '₹' : '$'}
                      {submittedRecord.amount} {submittedRecord.currency}
                    </strong>
                  </div>
                  <div className="receipt-row">
                    <span>Method:</span>
                    <span style={{ textTransform: 'uppercase' }}>{submittedRecord.method}</span>
                  </div>
                  {submittedRecord.transactionId && (
                    <div className="receipt-row">
                      <span>Ref / UTR:</span>
                      <code style={{ fontSize: '0.85rem' }}>{submittedRecord.transactionId}</code>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn-pay btn-pay-secondary condensed"
                  onClick={handleResetForm}
                >
                  SUBMIT ANOTHER RECORD
                </button>
              </div>
            ) : (
              <form className="supporter-form-body" onSubmit={handleSubmit}>
                {status.message && (
                  <div className={`form-alert ${status.type}`}>
                    {status.type === 'error' ? '⚠️ ' : '✓ '}
                    {status.message}
                  </div>
                )}

                {/* Quick amount chips */}
                <div className="form-group">
                  <label>
                    Select or Enter Amount ({activeTab === 'international' ? 'USD $' : 'INR ₹'})
                  </label>
                  <div className="amount-chips">
                    {(activeTab === 'international' ? INTERNATIONAL_PRESETS : DOMESTIC_PRESETS).map(
                      (preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`amount-chip ${amount === String(preset) ? 'active' : ''}`}
                          onClick={() => setAmount(String(preset))}
                        >
                          {activeTab === 'international' ? `$${preset}` : `₹${preset}`}
                        </button>
                      ),
                    )}
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Custom amount"
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>
                      Your Name <small>(required)</small>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Email Address <small>(optional / for receipt)</small>
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>
                      WhatsApp / Phone <small>(optional)</small>
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>

                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      className="form-select"
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                    >
                      <option value="upi_qr">UPI QR Code Scan</option>
                      <option value="upi_app">UPI App (GPay / PhonePe / Paytm / Cred)</option>
                      <option value="wise">Wise Transfer</option>
                      <option value="net_banking">Net Banking / IMPS</option>
                      <option value="card_razorpay">Card / Razorpay</option>
                      <option value="other">Other Method</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Transaction / UTR / Reference ID <small>(recommended for verification)</small>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 12-digit UPI Ref/UTR No. (4256XXXXXXXX) or Wise Transfer #"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Note / Message to Developer <small>(optional)</small>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any message, feature suggestion, or words of encouragement for Prashant..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit-support condensed"
                  disabled={isSubmitting}
                >
                  <ShieldCheck size={18} />
                  {isSubmitting ? 'SAVING DETAILS...' : 'RECORD PAYMENT DETAILS'}
                </button>

                {isAuthenticated && (
                  <p style={{ fontSize: '0.82rem', opacity: 0.7, textAlign: 'center', marginTop: '0.75rem' }}>
                    Linked to your account ({user?.email})
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
