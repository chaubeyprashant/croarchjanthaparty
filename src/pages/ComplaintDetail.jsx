import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'
import { useAuth } from '../context/auth-context.js'
import { absoluteUrl } from '../lib/site.js'
import {
  addComplaintComment,
  reportComplaintAsFake,
  setComplaintSupport,
  subscribeComments,
  subscribeComplaintDetail,
  subscribeStatusHistory,
  subscribeSupportRecord,
} from '../lib/complaints.js'

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function ComplaintDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const [complaint, setComplaint] = useState(null)
  const [history, setHistory] = useState([])
  const [comments, setComments] = useState([])
  const [supportsThis, setSupportsThis] = useState(false)
  const [commentDraft, setCommentDraft] = useState('')
  const [backendError, setBackendError] = useState('')
  const [alertsEnabled, setAlertsEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(`complaint-alert-${id}`) === '1'
  })

  useEffect(() => subscribeComplaintDetail(id, setComplaint, () => setBackendError('Unable to load complaint.')), [id])
  useEffect(() => subscribeStatusHistory(id, setHistory, () => setBackendError('Unable to load status timeline.')), [id])
  useEffect(() => subscribeComments(id, setComments, () => setBackendError('Unable to load comments.')), [id])
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return undefined
    return subscribeSupportRecord(id, user.id, setSupportsThis)
  }, [id, isAuthenticated, user])
  useEffect(() => {
    if (!alertsEnabled || typeof window === 'undefined' || history.length === 0) return
    const latest = history[history.length - 1]
    const key = `complaint-alert-last-${id}`
    const previous = window.localStorage.getItem(key)
    if (previous === latest.id) return
    window.localStorage.setItem(key, latest.id)
    if (window.Notification?.permission === 'granted') {
      new window.Notification(`Complaint ${complaint?.referenceId || ''} updated`, {
        body: `New status: ${latest.status.replace('_', ' ')}`,
      })
    }
  }, [alertsEnabled, complaint?.referenceId, history, id])

  const shareLinks = useMemo(() => {
    if (!complaint) return {}
    const pageUrl = absoluteUrl(`/complaints/${complaint.id}`)
    const message = encodeURIComponent(
      `Complaint ${complaint.referenceId}: ${complaint.title} (${complaint.city}, ${complaint.state})`,
    )
    return {
      whatsapp: `https://wa.me/?text=${message}%20${encodeURIComponent(pageUrl)}`,
      x: `https://x.com/intent/tweet?text=${message}&url=${encodeURIComponent(pageUrl)}`,
      pageUrl,
    }
  }, [complaint])

  const handleSupport = async () => {
    if (!isAuthenticated || !user?.id) return
    try {
      await setComplaintSupport(id, user.id, !supportsThis)
    } catch {
      setBackendError('Unable to update support right now.')
    }
  }

  const handleComment = async () => {
    if (!isAuthenticated || !commentDraft.trim()) return
    try {
      await addComplaintComment(id, { body: commentDraft }, user)
      setCommentDraft('')
    } catch {
      setBackendError('Unable to post comment right now.')
    }
  }

  const handleFakeReport = async () => {
    if (!isAuthenticated) return
    try {
      await reportComplaintAsFake(id, { reason: 'Potentially fake complaint' }, user)
    } catch {
      setBackendError('Unable to report right now.')
    }
  }

  const enableAlerts = async () => {
    if (typeof window === 'undefined' || !window.Notification) return
    const permission = await window.Notification.requestPermission()
    if (permission === 'granted') {
      window.localStorage.setItem(`complaint-alert-${id}`, '1')
      setAlertsEnabled(true)
    }
  }

  if (!complaint) {
    return (
      <section className="section page-head">
        <p className="eyebrow">Complaint</p>
        <h1>Loading complaint…</h1>
      </section>
    )
  }

  return (
    <>
      <Seo
        title={`${complaint.referenceId} • ${complaint.title}`}
        description={complaint.description.slice(0, 150)}
        canonicalPath={`/complaints/${complaint.id}`}
      />
      <section className="section page-head">
        <Reveal as="p" className="eyebrow">
          Complaint Tracking
        </Reveal>
        <Reveal as="h1" delay={60}>
          {complaint.title}
        </Reveal>
        <Reveal as="p" className="lead" delay={120}>
          {complaint.referenceId} · {complaint.issueType} · {complaint.city}, {complaint.state}
        </Reveal>
        <Reveal className="thread-meta" delay={140}>
          <span className="chip">{complaint.urgency}</span>
          <span className={`chip ${complaint.status === 'resolved' ? 'chip-green' : 'chip-orange'}`}>
            {complaint.status.replace('_', ' ')}
          </span>
          <span>{complaint.supportCount} supports</span>
          <span>{complaint.commentCount} comments</span>
        </Reveal>
        {backendError && <p className="auth-error">{backendError}</p>}
      </section>

      <section className="section complaint-detail-layout">
        <Reveal className="thread-composer complaint-detail-main">
          <h3>Description</h3>
          <p>{complaint.description}</p>
          {complaint.media?.length > 0 && (
            <>
              <h3>Evidence</h3>
              <div className="complaint-media-grid">
                {complaint.media.map((asset) => (
                  <a key={asset.url} href={asset.url} target="_blank" rel="noreferrer" className="complaint-media">
                    <strong>{asset.name}</strong>
                    <span>{asset.type || 'file'}</span>
                  </a>
                ))}
              </div>
            </>
          )}
          <div className="thread-actions">
            <button type="button" className="btn btn-dark" onClick={handleSupport} disabled={!isAuthenticated}>
              {supportsThis ? 'Withdraw support' : 'Support complaint'}
            </button>
            <button type="button" className="btn btn-link" onClick={handleFakeReport} disabled={!isAuthenticated}>
              Report fake complaint
            </button>
            <a className="btn btn-link" href={shareLinks.whatsapp} target="_blank" rel="noreferrer">
              Share on WhatsApp
            </a>
            <a className="btn btn-link" href={shareLinks.x} target="_blank" rel="noreferrer">
              Share on X
            </a>
            {!alertsEnabled && (
              <button type="button" className="btn btn-link" onClick={enableAlerts}>
                Enable browser alerts
              </button>
            )}
          </div>
          <div className="qr-card">
            <h3>QR tracking card</h3>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareLinks.pageUrl)}`}
              alt="Complaint tracking QR"
              loading="lazy"
            />
            <p className="muted">Scan to open this complaint status page.</p>
          </div>
        </Reveal>

        <aside className="community-aside">
          <Reveal className="rules-card">
            <h3>Status timeline</h3>
            <ol className="status-timeline">
              {history.map((entry) => (
                <li key={entry.id}>
                  <span className="status-pill">{entry.status.replace('_', ' ')}</span>
                  <p>{entry.note || 'Status updated'}</p>
                  <small>{timeAgo(entry.createdAt)}</small>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="rules-card" delay={80}>
            <h3>Discussion</h3>
            <div className="comments">
              {comments.length === 0 && <p className="muted">No comments yet.</p>}
              {comments.map((comment) => (
                <article key={comment.id} className="comment">
                  <p className="comment-meta">
                    <strong>{comment.authorName}</strong> · {timeAgo(comment.createdAt)}
                  </p>
                  <p>{comment.body}</p>
                </article>
              ))}
              {isAuthenticated ? (
                <div className="comment-form">
                  <textarea
                    rows="2"
                    value={commentDraft}
                    onChange={(event) => setCommentDraft(event.target.value)}
                    placeholder="Add a constructive comment..."
                  />
                  <button type="button" className="btn btn-primary" onClick={handleComment}>
                    Add comment →
                  </button>
                </div>
              ) : (
                <p className="muted">Log in to participate in discussion.</p>
              )}
            </div>
          </Reveal>

          <Reveal className="rules-card" delay={120}>
            <h3>Transparency</h3>
            <ul>
              <li>Identity stays hidden publicly for anonymous complaints.</li>
              <li>Admins can see full details for verification only.</li>
              <li>Repeated fake reports may be rejected.</li>
            </ul>
            <Link to="/complaints" className="btn btn-link">
              Back to complaint feed
            </Link>
          </Reveal>
        </aside>
      </section>
    </>
  )
}
