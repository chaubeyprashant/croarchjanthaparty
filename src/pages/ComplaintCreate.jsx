import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { ComplaintWizard } from '../components/complaints/ComplaintWizard.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'
import { breadcrumbJsonLd } from '../lib/seo-schema.js'
import { useAuth } from '../context/auth-context.js'
import { createComplaint } from '../lib/complaints.js'
import { db, firebaseConfigError, isFirebaseConfigured } from '../lib/firebase.js'
import { uploadComplaintFiles } from '../lib/uploads.js'

export function ComplaintCreate() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [backendError, setBackendError] = useState(() =>
    isFirebaseConfigured ? '' : firebaseConfigError(),
  )
  const [uploadProgress, setUploadProgress] = useState({})

  const handleSubmit = async (form) => {
    if (!isAuthenticated) {
      setBackendError('Please log in first to submit a complaint.')
      return
    }
    if (!isFirebaseConfigured || !db) return
    setSubmitting(true)
    setBackendError('')
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

      navigate(`/complaints/${result.id}`)
    } catch (error) {
      setBackendError(error?.message || 'Unable to submit complaint right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title="File a Complaint — Corruption & Civic Reporting"
        description="Submit a corruption or civic issue report with photo evidence, location pin, anonymous privacy controls, and a trackable reference ID."
        keywords="file corruption complaint India, civic complaint form, anonymous reporting, pothole complaint online, bribery report"
        canonicalPath="/complaints/new"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Public Complaints', path: '/complaints' },
          { name: 'File Complaint', path: '/complaints/new' },
        ])}
      />
      <section className="section page-head">
        <Reveal as="p" className="eyebrow">
          Complaint Submission
        </Reveal>
        <Reveal as="h1" delay={60}>
          Report an issue in <em className="accent-orange">5 steps.</em>
        </Reveal>
        <Reveal as="p" className="lead" delay={120}>
          Upload evidence, pin the location, choose urgency, and get a complaint reference ID for
          tracking.
        </Reveal>
        <Reveal className="hero-actions" delay={160}>
          <Link to="/complaints" className="btn btn-ghost">
            Back to feed
          </Link>
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
          />
        </Reveal>
      </section>
    </>
  )
}
