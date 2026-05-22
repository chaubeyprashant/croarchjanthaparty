import { useEffect, useMemo, useState } from 'react'
import { ISSUE_TYPES, URGENCY_LEVELS } from '../../lib/complaints.js'
import { MapPicker } from './MapPicker.jsx'

const DRAFT_KEY = 'cjp-complaint-draft-v1'

const LABELS = {
  en: {
    formTitle: 'File a public complaint',
    next: 'Next',
    back: 'Back',
    submit: 'Submit complaint',
    anonymous: 'Submit anonymously',
  },
  hi: {
    formTitle: 'शिकायत दर्ज करें',
    next: 'आगे',
    back: 'पीछे',
    submit: 'शिकायत भेजें',
    anonymous: 'गुमनाम शिकायत',
  },
}

const DEPARTMENTS = [
  'Municipal Corporation',
  'Public Works Department',
  'Police',
  'Water Board',
  'Electricity Board',
  'Urban Development',
  'Transport',
  'Other',
]

const INITIAL_STATE = {
  language: 'en',
  issueType: 'Corruption',
  anonymous: false,
  reporter: { name: '', mobile: '', email: '' },
  location: { state: '', city: '', area: '', address: '', pincode: '', lat: '', lng: '' },
  title: '',
  description: '',
  incidentDate: '',
  department: 'Municipal Corporation',
  officerName: '',
  estimatedImpact: '',
  urgency: 'medium',
  mediaFiles: [],
  voiceTranscript: '',
  honeypot: '',
}

function StepIssueType({ value, onChange }) {
  return (
    <div className="complaint-step-grid">
      {ISSUE_TYPES.map((issue) => (
        <button
          key={issue}
          type="button"
          className={issue === value ? 'chip is-active' : 'chip'}
          onClick={() => onChange(issue)}
        >
          {issue}
        </button>
      ))}
    </div>
  )
}

function StepReporter({ form, setForm }) {
  return (
    <div className="wizard-grid-two">
      <label>
        Full name
        <input
          type="text"
          value={form.reporter.name}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              reporter: { ...current.reporter, name: event.target.value },
            }))
          }
          required={!form.anonymous}
        />
      </label>
      <label>
        Mobile number
        <input
          type="text"
          value={form.reporter.mobile}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              reporter: { ...current.reporter, mobile: event.target.value },
            }))
          }
          required={!form.anonymous}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={form.reporter.email}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              reporter: { ...current.reporter, email: event.target.value },
            }))
          }
          required={!form.anonymous}
        />
      </label>
      <label className="recurring-row">
        <input
          type="checkbox"
          checked={form.anonymous}
          onChange={(event) => setForm((current) => ({ ...current, anonymous: event.target.checked }))}
        />
        Submit anonymously (identity visible to admins only)
      </label>
      <label>
        State
        <input
          type="text"
          value={form.location.state}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              location: { ...current.location, state: event.target.value },
            }))
          }
          required
        />
      </label>
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
        Area / Locality
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
      <label>
        PIN Code
        <input
          type="text"
          value={form.location.pincode}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              location: { ...current.location, pincode: event.target.value },
            }))
          }
          required
        />
      </label>
      <label className="wizard-full">
        Exact Address
        <textarea
          rows="2"
          value={form.location.address}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              location: { ...current.location, address: event.target.value },
            }))
          }
          required
        />
      </label>
    </div>
  )
}

function StepDetails({ form, setForm }) {
  const runVoiceCapture = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = form.language === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.start()
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || ''
      setForm((current) => ({
        ...current,
        description: current.description ? `${current.description}\n${transcript}` : transcript,
        voiceTranscript: transcript,
      }))
    }
  }

  return (
    <div className="wizard-grid-two">
      <label className="wizard-full">
        Complaint title
        <input
          type="text"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          required
          maxLength={120}
        />
      </label>
      <label className="wizard-full">
        Detailed description
        <textarea
          rows="5"
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          required
        />
      </label>
      <div className="wizard-full">
        <button type="button" className="btn btn-link" onClick={runVoiceCapture}>
          Voice to text (beta)
        </button>
      </div>
      <label>
        Date of incident
        <input
          type="date"
          value={form.incidentDate}
          onChange={(event) => setForm((current) => ({ ...current, incidentDate: event.target.value }))}
        />
      </label>
      <label>
        Department involved
        <select
          value={form.department}
          onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}
        >
          {DEPARTMENTS.map((department) => (
            <option key={department}>{department}</option>
          ))}
        </select>
      </label>
      <label>
        Officer name (optional)
        <input
          type="text"
          value={form.officerName}
          onChange={(event) => setForm((current) => ({ ...current, officerName: event.target.value }))}
        />
      </label>
      <label>
        Estimated damage / impact
        <input
          type="text"
          value={form.estimatedImpact}
          onChange={(event) => setForm((current) => ({ ...current, estimatedImpact: event.target.value }))}
          placeholder="Example: Road closed for 3 days, 200 households affected"
        />
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
    </div>
  )
}

function StepLocation({ form, setForm }) {
  return (
    <MapPicker
      value={form.location}
      onChange={(nextLocation) =>
        setForm((current) => ({
          ...current,
          location: { ...current.location, ...nextLocation },
        }))
      }
    />
  )
}

function StepReview({ form }) {
  return (
    <div className="wizard-review">
      <h3>{form.title || 'Untitled complaint'}</h3>
      <p>{form.description || 'No description yet.'}</p>
      <dl>
        <dt>Issue type</dt>
        <dd>{form.issueType}</dd>
        <dt>Urgency</dt>
        <dd>{form.urgency}</dd>
        <dt>Department</dt>
        <dd>{form.department}</dd>
        <dt>Area</dt>
        <dd>
          {form.location.area}, {form.location.city}, {form.location.state}
        </dd>
        <dt>Anonymous</dt>
        <dd>{form.anonymous ? 'Yes' : 'No'}</dd>
      </dl>
    </div>
  )
}

export function ComplaintWizard({ user, onSubmit, submitting, uploadProgress }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => {
    const base = {
      ...INITIAL_STATE,
      reporter: {
        ...INITIAL_STATE.reporter,
        name: user?.name || '',
        email: user?.email || '',
      },
    }
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
    try {
      const serializable = { ...form, mediaFiles: [] }
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable))
    } catch {
      // Ignore quota/private-mode failures.
    }
  }, [form])

  const labels = useMemo(() => LABELS[form.language] || LABELS.en, [form.language])

  const steps = [
    { title: 'Issue type', content: <StepIssueType value={form.issueType} onChange={(value) => setForm((current) => ({ ...current, issueType: value }))} /> },
    { title: 'Basic details', content: <StepReporter form={form} setForm={setForm} /> },
    { title: 'Complaint details', content: <StepDetails form={form} setForm={setForm} /> },
    { title: 'Media evidence', content: <StepMedia form={form} setForm={setForm} uploadProgress={uploadProgress} /> },
    { title: 'Location pin', content: <StepLocation form={form} setForm={setForm} /> },
    { title: 'Review & submit', content: <StepReview form={form} /> },
  ]

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.honeypot) return
    await onSubmit(form)
  }

  return (
    <form className="complaint-wizard" onSubmit={handleSubmit}>
      <div className="wizard-top">
        <p className="badge">
          <span className="pulse" /> {labels.formTitle}
        </p>
        <label>
          Language
          <select
            value={form.language}
            onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </label>
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

      <div className="wizard-actions">
        <button type="button" className="btn btn-link" disabled={step === 0} onClick={() => setStep(step - 1)}>
          {labels.back}
        </button>
        {step < steps.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
            {labels.next} →
          </button>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : `${labels.submit} →`}
          </button>
        )}
      </div>
    </form>
  )
}
