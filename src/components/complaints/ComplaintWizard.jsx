import { useEffect, useMemo, useState } from 'react'
import { ISSUE_TYPES, POLICE_ISSUE_TYPES, URGENCY_LEVELS } from '../../lib/complaints.js'
import { t } from '../../lib/complaint-i18n.js'
import { MapPicker } from './MapPicker.jsx'

const DRAFT_KEY = 'cjp-complaint-draft-v4'

const INITIAL_STATE = {
  issueType: 'Police Assault / Beating',
  anonymous: false,
  location: { state: '', city: '', area: '', address: '', pincode: '', lat: '', lng: '' },
  title: '',
  description: '',
  incidentDate: '',
  department: 'Police',
  officerName: '',
  estimatedImpact: '',
  urgency: 'high',
  mediaFiles: [],
  voiceTranscript: '',
  language: 'en',
  honeypot: '',
  reporter: {
    name: '',
    email: '',
    mobile: '',
    instagram: '',
    facebook: '',
    twitter: '',
    otherSocial: '',
  },
}

function isPoliceIssue(issueType) {
  return POLICE_ISSUE_TYPES.includes(issueType)
}

function loadDraft(defaults = {}) {
  const base = {
    ...INITIAL_STATE,
    ...defaults,
    reporter: { ...INITIAL_STATE.reporter, ...(defaults.reporter || {}) },
    location: { ...INITIAL_STATE.location, ...(defaults.location || {}) },
  }
  if (typeof window === 'undefined') return { form: base, restored: false }
  try {
    const persisted = window.localStorage.getItem(DRAFT_KEY)
    if (!persisted) return { form: base, restored: false }
    const parsed = JSON.parse(persisted)
    return {
      form: {
        ...base,
        ...parsed,
        mediaFiles: [],
        reporter: { ...base.reporter, ...(parsed.reporter || {}) },
        location: { ...base.location, ...(parsed.location || {}) },
      },
      restored: true,
    }
  } catch {
    return { form: base, restored: false }
  }
}

function StepDetails({ form, setForm, labels, voiceState, onVoice, policeFocus }) {
  const orderedTypes = policeFocus
    ? [...POLICE_ISSUE_TYPES, ...ISSUE_TYPES.filter((type) => !POLICE_ISSUE_TYPES.includes(type))]
    : ISSUE_TYPES

  return (
    <div className="wizard-grid-two">
      {policeFocus && (
        <p className="wizard-full police-hint">{labels.policeHint}</p>
      )}
      <label className="wizard-full">
        {labels.issueType}
        <div className="complaint-step-grid" style={{ marginTop: '0.5rem' }}>
          {orderedTypes.map((issue) => (
            <button
              key={issue}
              type="button"
              className={issue === form.issueType ? 'chip is-active' : 'chip'}
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  issueType: issue,
                  department: isPoliceIssue(issue) ? 'Police' : current.department,
                  urgency: isPoliceIssue(issue) && current.urgency === 'low' ? 'high' : current.urgency,
                }))
              }
            >
              {issue}
            </button>
          ))}
        </div>
      </label>
      <label className="wizard-full">
        {labels.title}
        <input
          type="text"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          required
          minLength={5}
          maxLength={120}
          placeholder={
            isPoliceIssue(form.issueType)
              ? 'Example: Beaten by police at Jantar Mantar on 10 Oct'
              : undefined
          }
        />
        <small className="muted">{labels.titleHint}</small>
      </label>
      <label className="wizard-full">
        {labels.description}
        <textarea
          rows="5"
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          required
          minLength={20}
        />
        <small className="muted">{labels.descriptionHint}</small>
      </label>
      <div className="wizard-full voice-row">
        <button type="button" className="btn btn-ghost" onClick={onVoice} disabled={voiceState === 'listening'}>
          {voiceState === 'listening' ? labels.voiceListening : labels.voiceStart}
        </button>
        {form.voiceTranscript && (
          <small className="muted">Last transcript: {form.voiceTranscript}</small>
        )}
      </div>
      <label>
        {labels.urgency}
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
        {labels.anonymous}
      </label>
    </div>
  )
}

function StepContact({ form, setForm, labels }) {
  const updateReporter = (field, value) =>
    setForm((current) => ({
      ...current,
      reporter: { ...current.reporter, [field]: value },
    }))

  return (
    <div className="wizard-stack">
      <p className="muted">{labels.contactIntro}</p>
      <div className="wizard-grid-two">
        <label>
          {labels.fullName}
          <input
            type="text"
            value={form.reporter.name}
            onChange={(event) => updateReporter('name', event.target.value)}
            required
            minLength={2}
          />
        </label>
        <label>
          {labels.phone}
          <input
            type="tel"
            value={form.reporter.mobile}
            onChange={(event) => updateReporter('mobile', event.target.value)}
            required
            minLength={8}
            placeholder="+91…"
          />
        </label>
        <label className="wizard-full">
          {labels.email}
          <input
            type="email"
            value={form.reporter.email}
            onChange={(event) => updateReporter('email', event.target.value)}
            required
          />
        </label>
        <label>
          {labels.instagram}
          <input
            type="text"
            value={form.reporter.instagram}
            onChange={(event) => updateReporter('instagram', event.target.value)}
            placeholder="@handle or profile URL"
          />
        </label>
        <label>
          {labels.facebook}
          <input
            type="text"
            value={form.reporter.facebook}
            onChange={(event) => updateReporter('facebook', event.target.value)}
            placeholder="Profile URL or name"
          />
        </label>
        <label>
          {labels.twitter}
          <input
            type="text"
            value={form.reporter.twitter}
            onChange={(event) => updateReporter('twitter', event.target.value)}
            placeholder="@handle"
          />
        </label>
        <label>
          {labels.otherSocial}
          <input
            type="text"
            value={form.reporter.otherSocial}
            onChange={(event) => updateReporter('otherSocial', event.target.value)}
            placeholder="YouTube, Telegram, etc."
          />
        </label>
      </div>
    </div>
  )
}

function StepLocation({ form, setForm, labels }) {
  return (
    <div className="wizard-stack">
      <div className="wizard-grid-two">
        <label>
          {labels.city}
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
          {labels.area}
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
      <p className="muted" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
        {labels.pinOptional}
      </p>
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

function StepMedia({ form, setForm, uploadProgress, labels, requireProof }) {
  const files = form.mediaFiles || []
  return (
    <div className="wizard-stack">
      <label>
        {labels.mediaLabel}
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          required={requireProof && files.length === 0}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              mediaFiles: Array.from(event.target.files || []),
            }))
          }
        />
      </label>
      {requireProof && <p className="auth-error" style={{ margin: 0 }}>{labels.mediaRequired}</p>}
      <ul className="wizard-file-list">
        {files.length === 0 && <li className="muted">{labels.noFiles}</li>}
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
        <h3>{labels.readyTitle}</h3>
        <p>{labels.readyBody}</p>
      </div>
    </div>
  )
}

export function ComplaintWizard({
  user,
  onSubmit,
  submitting,
  uploadProgress,
  backendError,
  successMessage,
  policeFocus = false,
}) {
  const defaults = useMemo(
    () => ({
      issueType: policeFocus ? 'Police Assault / Beating' : 'Corruption',
      department: policeFocus ? 'Police' : 'Other',
      urgency: policeFocus ? 'high' : 'medium',
      reporter: {
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.phone || '',
        instagram: '',
        facebook: '',
        twitter: '',
        otherSocial: '',
      },
    }),
    [policeFocus, user?.email, user?.name, user?.phone],
  )

  const initial = useMemo(() => loadDraft(defaults), [defaults])
  const [step, setStep] = useState(0)
  const [voiceState, setVoiceState] = useState('idle')
  const [voiceMessage, setVoiceMessage] = useState('')
  const [stepError, setStepError] = useState('')
  const [hasDraft, setHasDraft] = useState(initial.restored)
  const [form, setForm] = useState(initial.form)

  useEffect(() => {
    if (successMessage) {
      try {
        window.localStorage.removeItem(DRAFT_KEY)
      } catch {
        /* ignore */
      }
      return
    }
    try {
      const serializable = { ...form, mediaFiles: [] }
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable))
    } catch {
      /* ignore */
    }
  }, [form, successMessage])

  const labels = useMemo(() => {
    const keys = [
      'formTitle',
      'formTitlePolice',
      'language',
      'draftResume',
      'clearDraft',
      'stepIssue',
      'stepContact',
      'stepWhere',
      'stepEvidence',
      'issueType',
      'policeHint',
      'title',
      'titleHint',
      'description',
      'descriptionHint',
      'voiceStart',
      'voiceListening',
      'voiceUnsupported',
      'voiceError',
      'urgency',
      'anonymous',
      'contactIntro',
      'fullName',
      'email',
      'phone',
      'instagram',
      'facebook',
      'twitter',
      'otherSocial',
      'city',
      'area',
      'pinOptional',
      'mediaLabel',
      'mediaRequired',
      'noFiles',
      'readyTitle',
      'readyBody',
      'back',
      'next',
      'submit',
      'submitting',
      'success',
    ]
    return Object.fromEntries(keys.map((key) => [key, t(form.language, key)]))
  }, [form.language])

  const runVoiceCapture = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceMessage(labels.voiceUnsupported)
      return
    }
    setVoiceMessage('')
    setVoiceState('listening')
    const recognition = new SpeechRecognition()
    recognition.lang = form.language === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || ''
      setForm((current) => ({
        ...current,
        description: current.description ? `${current.description}\n${transcript}` : transcript,
        voiceTranscript: transcript,
      }))
      setVoiceState('idle')
    }
    recognition.onerror = () => {
      setVoiceState('idle')
      setVoiceMessage(labels.voiceError)
    }
    recognition.onend = () => setVoiceState('idle')
    recognition.start()
  }

  const clearDraft = () => {
    setForm({
      ...INITIAL_STATE,
      ...defaults,
      reporter: { ...INITIAL_STATE.reporter, ...defaults.reporter },
    })
    setHasDraft(false)
    setStep(0)
    setStepError('')
    try {
      window.localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* ignore */
    }
  }

  const requireProof = isPoliceIssue(form.issueType) || policeFocus

  const steps = [
    {
      title: labels.stepIssue,
      content: (
        <StepDetails
          form={form}
          setForm={setForm}
          labels={labels}
          voiceState={voiceState}
          onVoice={runVoiceCapture}
          policeFocus={policeFocus || isPoliceIssue(form.issueType)}
        />
      ),
    },
    {
      title: labels.stepContact,
      content: <StepContact form={form} setForm={setForm} labels={labels} />,
    },
    { title: labels.stepWhere, content: <StepLocation form={form} setForm={setForm} labels={labels} /> },
    {
      title: labels.stepEvidence,
      content: (
        <StepMedia
          form={form}
          setForm={setForm}
          uploadProgress={uploadProgress}
          labels={labels}
          requireProof={requireProof}
        />
      ),
    },
  ]

  const validateStep = (index) => {
    if (index === 0) {
      if ((form.title || '').trim().length < 5) return labels.titleHint
      if ((form.description || '').trim().length < 20) return labels.descriptionHint
    }
    if (index === 1) {
      if ((form.reporter.name || '').trim().length < 2) return 'Please enter your full name.'
      if ((form.reporter.email || '').trim().length < 5) return 'Please enter a valid email.'
      if ((form.reporter.mobile || '').trim().length < 8) return 'Please enter a valid phone number.'
    }
    if (index === 2) {
      if (!(form.location.city || '').trim() || !(form.location.area || '').trim()) {
        return 'Please enter city and locality.'
      }
    }
    if (index === 3 && requireProof && !(form.mediaFiles || []).length) {
      return labels.mediaRequired
    }
    return ''
  }

  const goNext = () => {
    const error = validateStep(step)
    if (error) {
      setStepError(error)
      return
    }
    setStepError('')
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.honeypot) return
    const error = validateStep(step)
    if (error) {
      setStepError(error)
      return
    }
    setStepError('')
    const finalForm = {
      ...form,
      reporter: {
        name: form.reporter.name.trim(),
        email: form.reporter.email.trim(),
        mobile: form.reporter.mobile.trim(),
        instagram: (form.reporter.instagram || '').trim(),
        facebook: (form.reporter.facebook || '').trim(),
        twitter: (form.reporter.twitter || '').trim(),
        otherSocial: (form.reporter.otherSocial || '').trim(),
      },
      incidentDate: form.incidentDate || new Date().toISOString().split('T')[0],
      department: isPoliceIssue(form.issueType) ? 'Police' : form.department || 'Other',
      officerName: form.officerName || 'Not specified',
      estimatedImpact: form.estimatedImpact || 'Not specified',
      location: {
        ...form.location,
        state: form.location.state || 'Not specified',
        pincode: form.location.pincode || '000000',
        address: form.location.address || 'Not specified',
      },
    }
    await onSubmit(finalForm)
  }

  return (
    <form className="complaint-wizard" onSubmit={handleSubmit}>
      <div className="wizard-top">
        <p className="badge">
          <span className="pulse" /> {policeFocus ? labels.formTitlePolice : labels.formTitle}
        </p>
        <label className="wizard-lang">
          {labels.language}
          <select
            value={form.language}
            onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </label>
      </div>

      {hasDraft && !successMessage && (
        <div className="draft-banner">
          <span>{labels.draftResume}</span>
          <button type="button" className="btn btn-link" onClick={clearDraft}>
            {labels.clearDraft}
          </button>
        </div>
      )}

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
        aria-hidden="true"
      />

      <section className="wizard-content">{steps[step].content}</section>

      {voiceMessage && (
        <p className="auth-hint" style={{ margin: '0 2rem' }}>
          {voiceMessage}
        </p>
      )}
      {stepError && (
        <div
          style={{
            padding: '1rem',
            margin: '0 2rem',
            background: '#ffeded',
            color: '#cc0000',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          {stepError}
        </div>
      )}
      {backendError && (
        <div
          style={{
            padding: '1rem',
            margin: '0 2rem',
            background: '#ffeded',
            color: '#cc0000',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          {backendError}
        </div>
      )}
      {successMessage && (
        <div
          style={{
            padding: '1rem',
            margin: '0 2rem',
            background: '#e6ffe6',
            color: '#008000',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          {successMessage}
        </div>
      )}

      <div className="wizard-actions">
        <button
          type="button"
          className="btn btn-link"
          disabled={step === 0 || Boolean(successMessage)}
          onClick={() => {
            setStepError('')
            setStep(step - 1)
          }}
        >
          {labels.back}
        </button>
        {step < steps.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={goNext}>
            {labels.next}
          </button>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={submitting || Boolean(successMessage)}>
            {submitting ? labels.submitting : successMessage ? labels.success : labels.submit}
          </button>
        )}
      </div>
    </form>
  )
}
