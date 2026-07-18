import { useEffect, useState } from 'react'
import { ISSUE_TYPES, URGENCY_LEVELS } from '../../lib/complaints.js'
import { MapPicker } from './MapPicker.jsx'

const DRAFT_KEY = 'cjp-complaint-draft-v2'

const INITIAL_STATE = {
  issueType: 'Corruption',
  anonymous: false,
  location: { state: '', city: '', area: '', address: '', pincode: '', lat: '', lng: '' },
  title: '',
  description: '',
  incidentDate: '',
  department: 'Other',
  officerName: '',
  estimatedImpact: '',
  urgency: 'medium',
  mediaFiles: [],
  voiceTranscript: '',
  language: 'en',
  honeypot: '',
}

function StepDetails({ form, setForm }) {
  return (
    <div className="wizard-grid-two">
      <label className="wizard-full">
        Issue Type
        <div className="complaint-step-grid" style={{ marginTop: '0.5rem' }}>
          {ISSUE_TYPES.map((issue) => (
            <button
              key={issue}
              type="button"
              className={issue === form.issueType ? 'chip is-active' : 'chip'}
              onClick={() => setForm((current) => ({ ...current, issueType: issue }))}
            >
              {issue}
            </button>
          ))}
        </div>
      </label>
      <label className="wizard-full">
        Complaint title
        <input
          type="text"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          required
          minLength={5}
          maxLength={120}
        />
        <small className="muted">At least 5 characters</small>
      </label>
      <label className="wizard-full">
        Detailed description
        <textarea
          rows="5"
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          required
          minLength={20}
        />
        <small className="muted">At least 20 characters</small>
      </label>
      <label>
        Urgency level
        <select
          value={form.urgency}
          onChange={(event) => setForm((current) => ({ ...current, urgency: event.target.value }))}
        >
          {URGENCY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>
      <label className="recurring-row" style={{ alignSelf: 'flex-end', paddingBottom: '0.5rem' }}>
        <input
          type="checkbox"
          checked={form.anonymous}
          onChange={(event) => setForm((current) => ({ ...current, anonymous: event.target.checked }))}
        />
        Submit anonymously (identity hidden from public)
      </label>
    </div>
  )
}

function StepLocation({ form, setForm }) {
  return (
    <div className="wizard-stack">
      <div className="wizard-grid-two">
        <label>
          City
          <input
            type="text"
            value={form.location.city}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                location: { ...current.location, city: event.target.value },
              }))
            }
            required
          />
        </label>
        <label>
          Locality / Area
          <input
            type="text"
            value={form.location.area}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                location: { ...current.location, area: event.target.value },
              }))
            }
            required
          />
        </label>
      </div>
      <p className="muted" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Optional: Pin exact location</p>
      <MapPicker
        value={form.location}
        onChange={(nextLocation) =>
          setForm((current) => ({
            ...current,
            location: { ...current.location, ...nextLocation },
          }))
        }
      />
    </div>
  )
}

function StepMedia({ form, setForm, uploadProgress }) {
  const files = form.mediaFiles || []
  return (
    <div className="wizard-stack">
      <label>
        Upload images, videos, documents (up to 20MB each)
        <input
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              mediaFiles: Array.from(event.target.files || []),
            }))
          }
        />
      </label>
      <ul className="wizard-file-list">
        {files.length === 0 && <li className="muted">No files selected yet.</li>}
        {files.map((file) => (
          <li key={file.name}>
            <span>{file.name}</span>
            <small>{Math.round(file.size / 1024)} KB</small>
            {uploadProgress[file.name] != null && (
              <progress value={uploadProgress[file.name]} max="100">
                {uploadProgress[file.name]}%
              </progress>
            )}
          </li>
        ))}
      </ul>
      <div className="wizard-review" style={{ marginTop: '2rem' }}>
        <h3>Ready to submit?</h3>
        <p>Please double check your details before proceeding.</p>
      </div>
    </div>
  )
}

export function ComplaintWizard({ user, onSubmit, submitting, uploadProgress, backendError, successMessage }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => {
    const base = { ...INITIAL_STATE }
    if (typeof window === 'undefined') return base
    try {
      const persisted = window.localStorage.getItem(DRAFT_KEY)
      if (persisted) return { ...base, ...JSON.parse(persisted) }
    } catch {
      return base
    }
    return base
  })

  useEffect(() => {
    if (successMessage) {
      setForm(INITIAL_STATE)
      try {
        window.localStorage.removeItem(DRAFT_KEY)
      } catch {}
      return
    }
    try {
      const serializable = { ...form, mediaFiles: [] }
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable))
    } catch {}
  }, [form, successMessage])

  const steps = [
    { title: "What's the issue?", content: <StepDetails form={form} setForm={setForm} /> },
    { title: 'Where is it?', content: <StepLocation form={form} setForm={setForm} /> },
    { title: 'Evidence & Submit', content: <StepMedia form={form} setForm={setForm} uploadProgress={uploadProgress} /> },
  ]

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.honeypot) return
    // Auto-fill hidden fields to satisfy strict Firestore rules
    const finalForm = {
      ...form,
      reporter: {
        name: user?.name || 'Citizen',
        email: user?.email || '',
        mobile: '',
      },
      incidentDate: form.incidentDate || new Date().toISOString().split('T')[0],
      department: form.department || 'Other',
      officerName: form.officerName || 'Not specified',
      estimatedImpact: form.estimatedImpact || 'Not specified',
      location: {
        ...form.location,
        state: form.location.state || 'Not specified',
        pincode: form.location.pincode || '000000',
        address: form.location.address || 'Not specified',
      }
    }
    await onSubmit(finalForm)
  }

  return (
    <form className="complaint-wizard" onSubmit={handleSubmit}>
      <div className="wizard-top">
        <p className="badge">
          <span className="pulse" /> File a public complaint
        </p>
      </div>
      <ol className="wizard-progress">
        {steps.map((item, index) => (
          <li key={item.title} className={index === step ? 'is-active' : index < step ? 'is-done' : ''}>
            <span>{index + 1}</span> {item.title}
          </li>
        ))}
      </ol>

      <input
        type="text"
        value={form.honeypot}
        onChange={(event) => setForm((current) => ({ ...current, honeypot: event.target.value }))}
        className="hp-input"
        tabIndex={-1}
        autoComplete="off"
      />

      <section className="wizard-content">{steps[step].content}</section>

      {backendError && (
        <div style={{ padding: '1rem', margin: '0 2rem', background: '#ffeded', color: '#cc0000', borderRadius: '8px', fontWeight: 'bold' }}>
          {backendError}
        </div>
      )}
      {successMessage && (
        <div style={{ padding: '1rem', margin: '0 2rem', background: '#e6ffe6', color: '#008000', borderRadius: '8px', fontWeight: 'bold' }}>
          {successMessage}
        </div>
      )}

      <div className="wizard-actions">
        <button type="button" className="btn btn-link" disabled={step === 0 || successMessage} onClick={() => setStep(step - 1)}>
          Back
        </button>
        {step < steps.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
            Next →
          </button>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={submitting || successMessage}>
            {submitting ? 'Submitting...' : successMessage ? 'Success!' : 'Submit complaint →'}
          </button>
        )}
      </div>
    </form>
  )
}
