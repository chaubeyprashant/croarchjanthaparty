import { useMemo } from 'react'
import { useAuth } from '../context/auth-context.js'
import { load } from '../lib/storage.js'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function Admin() {
  const { isAdmin, users, promoteRole, removeMember } = useAuth()

  const donations = useMemo(() => load('donations', []), [])
  const threads = useMemo(() => load('forum:threads', []), [])

  const stats = useMemo(() => {
    const total = donations.reduce((acc, d) => acc + d.amount, 0)
    const recurring = donations.filter((d) => d.recurring).length
    const members = users.filter((u) => u.role === 'member').length
    const admins = users.filter((u) => u.role === 'admin').length
    const openThreads = threads.filter((t) => t.status === 'open').length
    const reported = 0
    return { total, recurring, members, admins, openThreads, reported, donationCount: donations.length }
  }, [donations, threads, users])

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
          Donation ledger, member roster, moderation tools. Role-restricted to admins.
        </Reveal>
      </section>

      <section className="section">
        <div className="admin-stats">
          <Reveal className="stat">
            <span>Total raised</span>
            <strong>{formatCurrency(stats.total)}</strong>
            <em>{stats.donationCount} donations</em>
          </Reveal>
          <Reveal className="stat" delay={60}>
            <span>Recurring donors</span>
            <strong>{stats.recurring}</strong>
            <em>monthly active</em>
          </Reveal>
          <Reveal className="stat" delay={120}>
            <span>Members</span>
            <strong>{stats.members}</strong>
            <em>{stats.admins} admins</em>
          </Reveal>
          <Reveal className="stat" delay={180}>
            <span>Open threads</span>
            <strong>{stats.openThreads}</strong>
            <em>{stats.reported} reported</em>
          </Reveal>
        </div>
      </section>

      <section className="section admin-grid">
        <Reveal className="admin-card">
          <header>
            <h2>Donation ledger</h2>
            <p>Last 8 donations (mock data, persisted in localStorage).</p>
          </header>
          {donations.length === 0 ? (
            <p className="muted">No donations yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 8).map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <div>{entry.donor || 'Anonymous'}</div>
                      <small>{entry.email}</small>
                    </td>
                    <td>
                      <strong>{formatCurrency(entry.amount)}</strong>
                      {entry.recurring && <em className="role-tag">recurring</em>}
                    </td>
                    <td className="uppercase">{entry.method}</td>
                    <td>{timeAgo(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Reveal>

        <Reveal className="admin-card" delay={80}>
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
                        disabled={member.id === 'admin-1'}
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
