import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'
import { breadcrumbJsonLd } from '../lib/seo-schema.js'
import { ISSUE_TYPES, subscribeComplaints } from '../lib/complaints.js'
import { firebaseConfigError, isFirebaseConfigured } from '../lib/firebase.js'

const STATUS_FILTERS = ['all', 'submitted', 'under_review', 'verified', 'escalated', 'resolved', 'rejected']
const URGENCY_FILTERS = ['all', 'low', 'medium', 'high', 'emergency']

function urgencyClass(level) {
  if (level === 'emergency' || level === 'high') return 'chip chip-orange'
  if (level === 'resolved') return 'chip chip-green'
  return 'chip'
}

function statusBadge(status) {
  if (status === 'resolved') return 'chip chip-green'
  if (status === 'rejected') return 'chip'
  return 'chip chip-orange'
}

export function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [backendError, setBackendError] = useState(() =>
    isFirebaseConfigured ? '' : firebaseConfigError(),
  )
  const [stateFilter, setStateFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [issueFilter, setIssueFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined
    return subscribeComplaints(
      (rows) => {
        setComplaints(rows)
        setBackendError('')
      },
      () => setBackendError('Unable to load complaints from Firebase.'),
    )
  }, [])

  const states = useMemo(
    () => ['all', ...new Set(complaints.map((complaint) => complaint.state).filter(Boolean))],
    [complaints],
  )

  const cities = useMemo(
    () => [
      'all',
      ...new Set(
        complaints
          .filter((complaint) => stateFilter === 'all' || complaint.state === stateFilter)
          .map((complaint) => complaint.city)
          .filter(Boolean),
      ),
    ],
    [complaints, stateFilter],
  )

  const filtered = useMemo(() => {
    const base = complaints.filter((item) => {
      const byState = stateFilter === 'all' || item.state === stateFilter
      const byCity = cityFilter === 'all' || item.city === cityFilter
      const byIssue = issueFilter === 'all' || item.issueType === issueFilter
      const byStatus = statusFilter === 'all' || item.status === statusFilter
      const byUrgency = urgencyFilter === 'all' || item.urgency === urgencyFilter
      const q = search.toLowerCase()
      const bySearch =
        !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      return byState && byCity && byIssue && byStatus && byUrgency && bySearch
    })

    return [...base].sort((a, b) => {
      if (sort === 'support') return b.supportCount - a.supportCount
      if (sort === 'urgent') {
        const rank = { emergency: 4, high: 3, medium: 2, low: 1 }
        return (rank[b.urgency] || 0) - (rank[a.urgency] || 0)
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [complaints, stateFilter, cityFilter, issueFilter, statusFilter, urgencyFilter, search, sort])

  return (
    <>
      <Seo
        title="Public Complaints — Report Corruption & Civic Issues"
        description="Report corruption, potholes, road damage, bribery, and government negligence. Track complaint status publicly and support community accountability across India."
        keywords="public complaints India, corruption reporting, civic issue reporting, pothole report, RTI complaint, government negligence, CJP complaints"
        canonicalPath="/complaints"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Public Complaints', path: '/complaints' },
        ])}
      />
      <section className="section page-head">
        <Reveal as="p" className="eyebrow">
          Public Accountability
        </Reveal>
        <Reveal as="h1" delay={60}>
          Raise issues. <em className="accent-orange">Track action.</em>
        </Reveal>
        <Reveal as="p" className="lead" delay={120}>
          Report corruption, potholes, civic negligence, and public safety concerns. Every complaint
          gets a reference ID, status timeline, and public visibility.
        </Reveal>
        <Reveal className="hero-actions" delay={160}>
          <Link to="/complaints/new" className="btn btn-primary">
            File complaint →
          </Link>
          <Link to="/complaints/heatmap" className="btn btn-ghost">
            Civic heatmap
          </Link>
          <Link to="/admin/complaints" className="btn btn-ghost">
            Admin moderation
          </Link>
        </Reveal>
        {backendError && <p className="auth-error">{backendError}</p>}
      </section>

      <section className="section complaints-layout">
        <aside className="community-aside">
          <Reveal className="filter-card">
            <h3>Filters</h3>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title/description"
            />
            <label>
              State
              <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state === 'all' ? 'All states' : state}
                  </option>
                ))}
              </select>
            </label>
            <label>
              City
              <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All cities' : city}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select value={issueFilter} onChange={(event) => setIssueFilter(event.target.value)}>
                <option value="all">All categories</option>
                {ISSUE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {STATUS_FILTERS.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All statuses' : status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Urgency
              <select value={urgencyFilter} onChange={(event) => setUrgencyFilter(event.target.value)}>
                {URGENCY_FILTERS.map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {urgency === 'all' ? 'All urgency levels' : urgency}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sort by
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="latest">Latest</option>
                <option value="support">Most supported</option>
                <option value="urgent">Most urgent</option>
              </select>
            </label>
          </Reveal>
        </aside>

        <div className="community-main">
          <ul className="thread-list complaint-feed">
            {filtered.length === 0 && (
              <li className="empty-state">
                No complaints found for this filter set. Try different filters or file a new complaint.
              </li>
            )}
            {filtered.map((complaint, index) => (
              <Reveal as="li" key={complaint.id} className="thread-item complaint-item" delay={index * 25}>
                <div className="thread-body">
                  <div className="thread-meta">
                    <span className="chip">{complaint.issueType}</span>
                    <span className={urgencyClass(complaint.urgency)}>{complaint.urgency}</span>
                    <span className={statusBadge(complaint.status)}>{complaint.status.replace('_', ' ')}</span>
                    <span>{complaint.referenceId}</span>
                  </div>
                  <h3>{complaint.title}</h3>
                  <p>{complaint.description.slice(0, 180)}...</p>
                  <p className="muted">
                    {complaint.locality}, {complaint.city}, {complaint.state}
                  </p>
                  <div className="thread-actions">
                    <strong>{complaint.supportCount} supports</strong>
                    <strong>{complaint.commentCount} comments</strong>
                    <Link className="link" to={`/complaints/${complaint.id}`}>
                      View details
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
