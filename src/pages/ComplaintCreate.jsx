import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { ComplaintWizard } from '../components/complaints/ComplaintWizard.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'
import { breadcrumbJsonLd, policeComplaintHowToJsonLd } from '../lib/seo-schema.js'
import { useAuth } from '../context/auth-context.js'
import { createComplaint } from '../lib/complaints.js'
import { COMPLAINT_KEYWORDS, DEFAULT_KEYWORDS } from '../lib/site.js'
import { db, firebaseConfigError, isFirebaseConfigured } from '../lib/firebase.js'
import { uploadComplaintFiles } from '../lib/uploads.js'

export function ComplaintCreate() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const policeFocus =
    searchParams.get('focus') === 'police' || searchParams.get('type') === 'police'
  const { isAuthenticated, user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [backendError, setBackendError] = useState(() =>
    isFirebaseConfigured ? '' : firebaseConfigError(),
  )
  const [uploadProgress, setUploadProgress] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (form) => {
    if (!isAuthenticated) {
      setBackendError('Please log in first to submit a complaint.')
      return
    }
    if (!isFirebaseConfigured || !db) return
    setSubmitting(true)
    setBackendError('')
    setSuccessMessage('')
    try {
      const result = await createComplaint(
        {
          issueType: form.issueType,
          title: form.title,
          description: form.description,
          incidentDate: form.incidentDate,
          department: form.department,
          officerName: form.officerName,
          estimatedImpact: form.estimatedImpact,
          urgency: form.urgency,
          location: form.location,
          anonymous: form.anonymous,
          reporter: form.reporter,
          language: form.language,
          voiceTranscript: form.voiceTranscript,
          media: [],
        },
        user,
      )

      if (form.mediaFiles?.length) {
        const uploaded = await uploadComplaintFiles({
          files: form.mediaFiles,
          complaintId: result.id,
          onProgress: (name, progress) =>
            setUploadProgress((current) => ({ ...current, [name]: progress })),
        })
        await updateDoc(doc(db, 'complaints', result.id), { media: uploaded })
      }

      setSuccessMessage('Complaint submitted successfully! Redirecting...')
      setTimeout(() => {
        navigate(`/complaints/${result.id}`)
      }, 2500)
    } catch (error) {
      console.error(error)
      setBackendError(error?.message || 'Unable to submit complaint right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title={
          policeFocus
            ? 'Report Police Brutality — Photo/Video Proof'
            : 'File a Complaint — Corruption & Civic Reporting'
        }
        description={
          policeFocus
            ? 'Report police beating, molestation, or misbehavior with photo/video proof. Share name, phone, email, and social media privately for follow-up.'
            : 'Submit a corruption or civic issue report with photo evidence, location pin, anonymous privacy controls, and a trackable reference ID.'
        }
        keywords={`${COMPLAINT_KEYWORDS}, ${DEFAULT_KEYWORDS}`}
        canonicalPath="/complaints/new"
        jsonLd={[
          policeComplaintHowToJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Public Complaints', path: '/complaints' },
            { name: 'File Complaint', path: '/complaints/new' },
          ]),
        ]}
      />
      <section className="section page-head">
        <Reveal as="p" className="eyebrow">
          {policeFocus ? 'Police Misconduct Reporting' : 'Complaint Submission'}
        </Reveal>
        <Reveal as="h1" delay={60}>
          {policeFocus ? (
            <>
              Report police <em className="accent-orange">brutality</em> with proof.
            </>
          ) : (
            <>
              Report an issue in <em className="accent-orange">4 steps.</em>
            </>
          )}
        </Reveal>
        <Reveal as="p" className="lead" delay={120}>
          {policeFocus
            ? 'Beaten, molested, or mistreated by police? Upload image/video proof and leave your name, phone, email, and Instagram/Facebook so we can verify and follow up privately.'
            : 'Upload evidence, add your contact + socials, pin the location, and get a trackable reference ID with status notifications.'}
        </Reveal>
        <Reveal className="hero-actions" delay={160}>
          <Link to="/complaints" className="btn btn-ghost">
            Back to feed
          </Link>
          {!policeFocus && (
            <Link to="/complaints/new?focus=police" className="btn btn-primary">
              Police brutality form →
            </Link>
          )}
        </Reveal>
        {backendError && <p className="auth-error">{backendError}</p>}
        {!isAuthenticated && (
          <p className="auth-hint">
            Log in from the top-right menu, then return here to submit your complaint securely.
          </p>
        )}
      </section>

      <section className="section">
        <Reveal className="wizard-shell">
          <ComplaintWizard
            user={user}
            onSubmit={handleSubmit}
            submitting={submitting}
            uploadProgress={uploadProgress}
            backendError={backendError}
            successMessage={successMessage}
            policeFocus={policeFocus}
          />
        </Reveal>
      </section>
    </>
  )
}
