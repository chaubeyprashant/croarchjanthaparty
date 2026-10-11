import { useEffect, useMemo, useState } from 'react'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { Check, Copy, Trash2, Search, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/auth-context.js'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'
import { db, firebaseConfigError, isFirebaseConfigured, normalizeDate } from '../lib/firebase.js'
import {
  deleteDevSupporter,
  subscribeDevSupporters,
  subscribeDonateVisits,
  updateSupporterStatus,
} from '../lib/supporters.js'

function formatCurrency(amount, currency = 'INR') {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `₹${amount}`
  }
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function Admin() {
  const { isAdmin, user, users, promoteRole, removeMember } = useAuth()
  const [supporters, setSupporters] = useState([])
  const [legacyDonations, setLegacyDonations] = useState([])
  const [visits, setVisits] = useState([])
  const [threads, setThreads] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [copiedId, setCopiedId] = useState(null)
  const [backendError, setBackendError] = useState(() =>
    isFirebaseConfigured ? '' : firebaseConfigError(),
  )

  // Subscribe to new dev_supporters collection
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return undefined
    const unsubscribe = subscribeDevSupporters(
      (data) => {
        setSupporters(data)
        setBackendError('')
      },
      () => {
        setBackendError('Unable to load dev supporters from Firebase.')
      },
      100,
    )
    return () => unsubscribe()
  }, [])

  // Subscribe to donate_page_visits collection
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return undefined
    const unsubscribe = subscribeDonateVisits(
      (data) => setVisits(data),
      () => {},
      50,
    )
    return () => unsubscribe()
  }, [])

  // Also subscribe to legacy donations collection for backwards compatibility
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return undefined
    const donationsQuery = query(collection(db, 'donations'), orderBy('createdAt', 'desc'), limit(50))
    return onSnapshot(
      donationsQuery,
      (snapshot) => {
        setLegacyDonations(
          snapshot.docs.map((docSnap) => {
            const data = docSnap.data()
            return {
              id: docSnap.id,
              name: data.donor || data.name || 'Anonymous',
              email: data.email || '',
              phone: data.phone || '',
              amount: data.amount || 0,
              currency: data.currency || 'INR',
              recurring: Boolean(data.recurring),
              method: data.method || 'upi',
              transactionId: data.transactionId || '',
              message: data.message || '',
              status: data.status || 'submitted',
              createdAt: normalizeDate(data.createdAt) || new Date().toISOString(),
            }
          }),
        )
      },
      () => {
        // Non-blocking
      },
    )
  }, [])

  // Forum threads subscription
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return undefined
    const threadsQuery = query(collection(db, 'threads'), orderBy('createdAt', 'desc'), limit(50))
    return onSnapshot(
      threadsQuery,
      (snapshot) => {
        setThreads(
          snapshot.docs.map((docSnap) => {
            const data = docSnap.data()
            return {
              id: docSnap.id,
              title: data.title || '',
              category: data.category || 'General',
              author: data.author || 'Member',
              votes: data.votes || 0,
              status: data.status || 'open',
            }
          }),
        )
      },
      () => {
        setBackendError('Unable to load threads from Firebase.')
      },
    )
  }, [])

  // Combined supporters list, prioritizing new dev_supporters collection
  const allSupporters = useMemo(() => {
    if (supporters.length > 0) return supporters
    return legacyDonations
  }, [supporters, legacyDonations])

  const filteredSupporters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return allSupporters.filter((item) => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.transactionId && item.transactionId.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q))

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'verified' && item.status === 'verified') ||
        (statusFilter === 'submitted' && item.status !== 'verified')

      return matchesSearch && matchesStatus
    })
  }, [allSupporters, searchQuery, statusFilter])

  const stats = useMemo(() => {
    const total = allSupporters.reduce((acc, d) => acc + (d.amount || 0), 0)
    const verified = allSupporters.filter((d) => d.status === 'verified').length
    const members = users.filter((u) => u.role === 'member').length
    const admins = users.filter((u) => u.role === 'admin').length
    const openThreads = threads.filter((t) => t.status === 'open').length
    const reported = 0
    return {
      total,
      verified,
      members,
      admins,
      openThreads,
      reported,
      donationCount: allSupporters.length,
    }
  }, [allSupporters, threads, users])

  const handleCopyTransaction = (id, text) => {
    if (!text) return
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'verified' ? 'submitted' : 'verified'
    await updateSupporterStatus(item.id, newStatus)
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete support record for "${item.name}"?`)) return
    await deleteDevSupporter(item.id)
  }

  if (!isAdmin) {
    return (
      <>
        <Seo
          title="Admin Console"
          description="Internal admin dashboard for managing members, moderation, and donation analytics."
          canonicalPath="/admin"
          noindex
        />
        <section className="section page-head">
          <Reveal as="p" className="eyebrow">
            Admin Console
          </Reveal>
          <Reveal as="h1" delay={60}>
            Admin access <em className="accent-orange">required.</em>
          </Reveal>
          <Reveal as="p" className="lead" delay={120}>
            Please log in with an admin account to access moderation, members, and donation
            analytics.
          </Reveal>
          {backendError && <p className="auth-error">{backendError}</p>}
        </section>
      </>
    )
  }

  return (
    <>
      <Seo
        title="Admin Console"
        description="Internal admin dashboard for managing members, moderation, and donation analytics."
        canonicalPath="/admin"
        noindex
      />
      <section className="section page-head">
        <Reveal as="p" className="eyebrow">
          Admin Console
        </Reveal>
        <Reveal as="h1" delay={60}>
          Run the <em className="accent-orange">swarm.</em>
        </Reveal>
        <Reveal as="p" className="lead" delay={120}>
          Dev supporter ledger, visitor logs, member roster, moderation tools. Role-restricted to admins.
        </Reveal>
        {backendError && <p className="auth-error">{backendError}</p>}
      </section>

      <section className="section">
        <div className="admin-stats">
          <Reveal className="stat">
            <span>Dev support raised</span>
            <strong>{formatCurrency(stats.total)}</strong>
            <em>{stats.donationCount} supporters</em>
          </Reveal>
          <Reveal className="stat" delay={60}>
            <span>Page Visitors</span>
            <strong>{visits.length}</strong>
            <em>live logged (/donate)</em>
          </Reveal>
          <Reveal className="stat" delay={120}>
            <span>Verified Payments</span>
            <strong>{stats.verified}</strong>
            <em>out of {stats.donationCount}</em>
          </Reveal>
          <Reveal className="stat" delay={180}>
            <span>Members</span>
            <strong>{stats.members}</strong>
            <em>{stats.admins} admins</em>
          </Reveal>
        </div>
      </section>

      <section className="section admin-grid">
        <Reveal className="admin-card admin-card-wide">
          <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h2>Support the Dev Ledger</h2>
              <p>Real-time records from the <code>dev_supporters</code> Firestore collection.</p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                <input
                  type="text"
                  placeholder="Search donor, email, UTR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem 0.45rem 2rem',
                    border: '1.5px solid var(--ink)',
                    borderRadius: '0.3rem',
                    background: 'var(--paper)',
                    fontSize: '0.88rem',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  border: '1.5px solid var(--ink)',
                  borderRadius: '0.3rem',
                  background: 'var(--paper)',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit',
                }}
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="submitted">Pending / Submitted</option>
              </select>
            </div>
          </header>

          {filteredSupporters.length === 0 ? (
            <p className="muted" style={{ padding: '1.5rem', textAlign: 'center' }}>
              {allSupporters.length === 0
                ? 'No supporter records in dev_supporters yet.'
                : 'No supporter records match your search filter.'}
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Supporter</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Ref / UTR</th>
                    <th>Note / Message</th>
                    <th>Status</th>
                    <th>When</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSupporters.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{entry.name || 'Anonymous'}</div>
                        {entry.email && <small style={{ display: 'block', opacity: 0.8 }}>{entry.email}</small>}
                        {entry.phone && <small style={{ display: 'block', opacity: 0.7 }}>📞 {entry.phone}</small>}
                      </td>
                      <td>
                        <strong>{formatCurrency(entry.amount, entry.currency)}</strong>
                      </td>
                      <td className="uppercase" style={{ fontSize: '0.85rem' }}>
                        {entry.method}
                      </td>
                      <td>
                        {entry.transactionId ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <code style={{ fontSize: '0.82rem', background: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>
                              {entry.transactionId}
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopyTransaction(entry.id, entry.transactionId)}
                              title="Copy Reference"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                            >
                              {copiedId === entry.id ? <Check size={14} color="green" /> : <Copy size={14} opacity={0.6} />}
                            </button>
                          </div>
                        ) : (
                          <span style={{ opacity: 0.4 }}>—</span>
                        )}
                      </td>
                      <td style={{ maxWidth: '200px', fontSize: '0.88rem' }}>
                        {entry.message ? <em>&ldquo;{entry.message}&rdquo;</em> : <span style={{ opacity: 0.4 }}>—</span>}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            entry.status === 'verified' ? 'status-resolved' : 'status-open'
                          }`}
                          style={{ fontSize: '0.78rem', textTransform: 'uppercase' }}
                        >
                          {entry.status || 'submitted'}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                        {timeAgo(entry.createdAt)}
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="link"
                            onClick={() => handleToggleStatus(entry)}
                            title="Toggle verification"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                          >
                            <CheckCircle size={14} />
                            {entry.status === 'verified' ? 'Unverify' : 'Verify'}
                          </button>
                          <button
                            type="button"
                            className="link danger"
                            onClick={() => handleDelete(entry)}
                            title="Delete record"
                            style={{ padding: '0.2rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Reveal>

        <Reveal className="admin-card" delay={80}>
          <header>
            <h2>Page Visitors (/donate)</h2>
            <p>Live visitors logged in <code>donate_page_visits</code>.</p>
          </header>
          {visits.length === 0 ? (
            <p className="muted">No visitors logged yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Device</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {visits.slice(0, 8).map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div>{v.userName}</div>
                      {v.userEmail && <small>{v.userEmail}</small>}
                    </td>
                    <td className="uppercase">{v.device}</td>
                    <td>{timeAgo(v.visitedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Reveal>

        <Reveal className="admin-card" delay={100}>
          <header>
            <h2>Members</h2>
            <p>Promote, demote, or remove. Demo data shown.</p>
          </header>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div>{member.name}</div>
                    <small>{member.email}</small>
                  </td>
                  <td className="uppercase">{member.role}</td>
                  <td>{timeAgo(member.joinedAt)}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="link"
                        onClick={() =>
                          promoteRole(member.id, member.role === 'admin' ? 'member' : 'admin')
                        }
                      >
                        {member.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => removeMember(member.id)}
                        disabled={member.id === user?.id}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal className="admin-card admin-card-wide" delay={140}>
          <header>
            <h2>Moderation</h2>
            <p>Top forum threads. Pin, resolve, or delete directly from the Community page.</p>
          </header>
          {threads.length === 0 ? (
            <p className="muted">No threads yet.</p>
          ) : (
            <ul className="mod-list">
              {threads.slice(0, 5).map((thread) => (
                <li key={thread.id}>
                  <div>
                    <strong>{thread.title}</strong>
                    <small>
                      {thread.category} · {thread.author} · {thread.votes} votes
                    </small>
                  </div>
                  <span className={`status-pill status-${thread.status}`}>{thread.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </section>
    </>
  )
}
