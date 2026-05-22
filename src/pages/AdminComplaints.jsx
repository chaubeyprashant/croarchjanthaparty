import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'
import { useAuth } from '../context/auth-context.js'
import { COMPLAINT_STATUSES, subscribeComplaints, updateComplaintStatus } from '../lib/complaints.js'

export function AdminComplaints() {
  const { isAdmin, user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [statusDraft, setStatusDraft] = useState({})
  const [noteDraft, setNoteDraft] = useState({})
  const [query, setQuery] = useState('')
  const [backendError, setBackendError] = useState('')

  useEffect(
    () =>
      subscribeComplaints(
        (rows) => {
          setComplaints(rows)
          setBackendError('')
        },
        () => setBackendError('Unable to load complaints for moderation.'),
      ),
    [],
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return complaints.filter(
      (item) =>
        !q ||
        item.referenceId.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q),
    )
  }, [complaints, query])

  const handleUpdate = async (complaintId) => {
    const status = statusDraft[complaintId]
    if (!status) return
    try {
      await updateComplaintStatus(complaintId, status, noteDraft[complaintId], user)
      setNoteDraft((current) => ({ ...current, [complaintId]: '' }))
    } catch {
      setBackendError('Unable to update complaint status.')
    }
  }

  if (!isAdmin) {
    return (
      <section className="section page-head">
        <p className="eyebrow">Admin Complaints</p>
        <h1>Admin access required.</h1>
      </section>
    )
  }

  return (
    <>
      <Seo title="Admin Complaints" canonicalPath="/admin/complaints" noindex />
      <section className="section page-head">
        <Reveal as="p" className="eyebrow">
          Complaint Moderation
        </Reveal>
        <Reveal as="h1" delay={60}>
          Verify, escalate, <em className="accent-orange">resolve.</em>
        </Reveal>
        <Reveal as="p" className="lead" delay={120}>
          Review complaint evidence, update status timelines, and log moderation notes.
        </Reveal>
        <Reveal className="hero-actions" delay={150}>
          <Link to="/complaints" className="btn btn-ghost">
            Public feed
          </Link>
          <Link to="/admin" className="btn btn-ghost">
            Back to admin home
          </Link>
        </Reveal>
        {backendError && <p className="auth-error">{backendError}</p>}
      </section>

      <section className="section">
        <Reveal className="admin-card">
          <header>
            <h2>Moderation queue</h2>
            <p>Update status with an audit note. This writes status history and admin logs.</p>
          </header>
          <input
            type="search"
            placeholder="Search by reference, title, city"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <table className="data-table">
            <thead>
              <tr>
                <th>Complaint</th>
                <th>Location</th>
                <th>Current status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((complaint) => (
                <tr key={complaint.id}>
                  <td>
                    <strong>{complaint.referenceId}</strong>
                    <div>{complaint.title}</div>
                    <small>{complaint.issueType}</small>
                  </td>
                  <td>
                    {complaint.city}, {complaint.state}
                    <small>{complaint.locality}</small>
                  </td>
                  <td>
                    <span className="status-pill">{complaint.status.replace('_', ' ')}</span>
                  </td>
                  <td>
                    <div className="complaint-admin-actions">
                      <select
                        value={statusDraft[complaint.id] || complaint.status}
                        onChange={(event) =>
                          setStatusDraft((current) => ({
                            ...current,
                            [complaint.id]: event.target.value,
                          }))
                        }
                      >
                        {COMPLAINT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Status note (optional)"
                        value={noteDraft[complaint.id] || ''}
                        onChange={(event) =>
                          setNoteDraft((current) => ({
                            ...current,
                            [complaint.id]: event.target.value,
                          }))
                        }
                      />
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn-dark"
                          onClick={() => handleUpdate(complaint.id)}
                        >
                          Save
                        </button>
                        <Link className="btn btn-link" to={`/complaints/${complaint.id}`}>
                          Open
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>
    </>
  )
}
