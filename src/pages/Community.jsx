import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/auth-context.js'
import { load, save } from '../lib/storage.js'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'

const THREADS_KEY = 'forum:threads'

const SEED_THREADS = [
  {
    id: 't-1',
    title: 'Should we publish the legal team\'s notes on the UAPA clause?',
    body:
      'Transparency-first or strategy-first? Open thread on whether to publish working notes for Manifesto Point 02.',
    category: 'Legal',
    author: 'Convenor',
    authorId: 'admin-1',
    createdAt: '2026-05-17T08:30:00.000Z',
    pinned: true,
    status: 'open',
    votes: 184,
    comments: [
      {
        id: 'c-1-1',
        author: 'Convenor',
        authorId: 'admin-1',
        body: 'Lean toward publishing. The point is accountability.',
        createdAt: '2026-05-17T09:00:00.000Z',
      },
    ],
  },
  {
    id: 't-2',
    title: 'Designing a city-by-city rollout for poster No. 002',
    body:
      'Volunteers in Pune, Hyderabad, and Kolkata: drop your distribution windows here. We\'ll batch print.',
    category: 'Volunteers',
    author: 'Meera',
    authorId: 'seed-2',
    createdAt: '2026-05-19T11:45:00.000Z',
    pinned: false,
    status: 'open',
    votes: 92,
    comments: [],
  },
  {
    id: 't-3',
    title: 'Tracking godi media bank accounts — open dataset?',
    body:
      'Started compiling publicly available filings for Manifesto Point 04. Looking for a researcher to verify.',
    category: 'Research',
    author: 'Zoya',
    authorId: 'seed-3',
    createdAt: '2026-05-20T15:10:00.000Z',
    pinned: false,
    status: 'open',
    votes: 56,
    comments: [
      {
        id: 'c-3-1',
        author: 'Aarav',
        authorId: 'seed-4',
        body: 'I can help with verification. DM me a sample row.',
        createdAt: '2026-05-20T16:00:00.000Z',
      },
    ],
  },
]

const CATEGORIES = ['All', 'General', 'Campaigns', 'Volunteers', 'Legal', 'Research', 'Funding']

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function Community() {
  const { isAuthenticated, isAdmin, user } = useAuth()
  const [threads, setThreads] = useState(() => {
    const stored = load(THREADS_KEY, null)
    if (stored && stored.length) return stored
    save(THREADS_KEY, SEED_THREADS)
    return SEED_THREADS
  })
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('top')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState({ title: '', body: '', category: 'General' })
  const [activeThreadId, setActiveThreadId] = useState(null)
  const [commentDraft, setCommentDraft] = useState('')

  useEffect(() => {
    save(THREADS_KEY, threads)
  }, [threads])

  const filtered = useMemo(() => {
    const base = threads.filter((thread) => {
      const inCategory = filter === 'All' || thread.category === filter
      const inQuery =
        !query ||
        thread.title.toLowerCase().includes(query.toLowerCase()) ||
        thread.body.toLowerCase().includes(query.toLowerCase())
      return inCategory && inQuery
    })
    const sorted = [...base].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      if (sort === 'top') return b.votes - a.votes
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    return sorted
  }, [threads, filter, sort, query])

  const handlePost = (event) => {
    event.preventDefault()
    if (!isAuthenticated) return
    if (!draft.title.trim() || !draft.body.trim()) return
    const thread = {
      id: `t-${Date.now().toString(36)}`,
      title: draft.title.trim(),
      body: draft.body.trim(),
      category: draft.category,
      author: user.name,
      authorId: user.id,
      createdAt: new Date().toISOString(),
      pinned: false,
      status: 'open',
      votes: 1,
      comments: [],
    }
    setThreads((current) => [thread, ...current])
    setDraft({ title: '', body: '', category: 'General' })
  }

  const handleVote = (threadId, delta) => {
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? { ...thread, votes: thread.votes + delta } : thread,
      ),
    )
  }

  const handleComment = (threadId) => {
    if (!commentDraft.trim() || !isAuthenticated) return
    const comment = {
      id: `c-${Date.now().toString(36)}`,
      author: user.name,
      authorId: user.id,
      body: commentDraft.trim(),
      createdAt: new Date().toISOString(),
    }
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? { ...thread, comments: [...thread.comments, comment] }
          : thread,
      ),
    )
    setCommentDraft('')
  }

  const handleStatus = (threadId, status) => {
    setThreads((current) =>
      current.map((thread) => (thread.id === threadId ? { ...thread, status } : thread)),
    )
  }

  const handlePin = (threadId) => {
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? { ...thread, pinned: !thread.pinned } : thread,
      ),
    )
  }

  const handleDelete = (threadId) => {
    setThreads((current) => current.filter((thread) => thread.id !== threadId))
    if (activeThreadId === threadId) setActiveThreadId(null)
  }

  return (
    <>
      <Seo
        title="Community Forum"
        description="Join the Cockroach Janta Party community forum to debate policy, organize campaigns, and collaborate with volunteers across cities."
        keywords="community forum, political discussion, campaign volunteers, grassroots organizing, Cockroach Janta Party"
        canonicalPath="/community"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'DiscussionForumPosting',
          headline: 'Cockroach Janta Party Community Forum',
          url: 'https://cockroachjantaparty.org/community',
          articleSection: 'Community',
        }}
      />
      <section className="section page-head">
        <Reveal as="p" className="eyebrow">
          Community Forum
        </Reveal>
        <Reveal as="h1" delay={60}>
          Argue. Organize. <em className="accent-green">Win.</em>
        </Reveal>
        <Reveal as="p" className="lead" delay={120}>
          A public square for members. Post a campaign idea, debate the manifesto, recruit
          volunteers, or just send a meme. Upvote what matters. Ignore the rest.
        </Reveal>
      </section>

      <section className="section community-layout">
        <aside className="community-aside">
          <Reveal className="filter-card">
            <h3>Filter</h3>
            <input
              type="search"
              placeholder="Search threads..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="filter-chips">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={cat === filter ? 'chip is-active' : 'chip'}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="sort-row">
              <label>
                <input
                  type="radio"
                  name="sort"
                  checked={sort === 'top'}
                  onChange={() => setSort('top')}
                />
                Top
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  checked={sort === 'new'}
                  onChange={() => setSort('new')}
                />
                Newest
              </label>
            </div>
          </Reveal>

          <Reveal className="rules-card" delay={80}>
            <h3>House rules</h3>
            <ul>
              <li>Bring receipts. Vibes are not evidence.</li>
              <li>No casteism, communalism, or harassment.</li>
              <li>Off-topic posts get moved, not deleted.</li>
            </ul>
          </Reveal>
        </aside>

        <div className="community-main">
          {isAuthenticated ? (
            <Reveal as="form" className="thread-composer" onSubmit={handlePost}>
              <h3>Start a thread</h3>
              <input
                type="text"
                placeholder="Title — be specific"
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                required
                maxLength={120}
              />
              <textarea
                rows="3"
                placeholder="What's on your mind?"
                value={draft.body}
                onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                required
                maxLength={1200}
              />
              <div className="composer-row">
                <select
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                >
                  {CATEGORIES.filter((cat) => cat !== 'All').map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary">
                  Post thread →
                </button>
              </div>
            </Reveal>
          ) : (
            <Reveal className="login-prompt">
              <p>
                <strong>Log in to post and comment.</strong> Reading is free. Posting requires
                being a member.
              </p>
            </Reveal>
          )}

          <ul className="thread-list">
            {filtered.length === 0 && (
              <li className="empty-state">No threads match. Be the first to post.</li>
            )}
            {filtered.map((thread, index) => (
              <Reveal as="li" key={thread.id} delay={index * 40} className="thread-item">
                <div className="thread-votes">
                  <button
                    type="button"
                    aria-label="Upvote"
                    disabled={!isAuthenticated}
                    onClick={() => handleVote(thread.id, 1)}
                  >
                    ▲
                  </button>
                  <strong>{thread.votes}</strong>
                  <button
                    type="button"
                    aria-label="Downvote"
                    disabled={!isAuthenticated}
                    onClick={() => handleVote(thread.id, -1)}
                  >
                    ▼
                  </button>
                </div>
                <div className="thread-body">
                  <div className="thread-meta">
                    <span className="chip">{thread.category}</span>
                    {thread.pinned && <span className="chip chip-orange">📌 Pinned</span>}
                    {thread.status === 'resolved' && (
                      <span className="chip chip-green">Resolved</span>
                    )}
                    <span>
                      {thread.author} · {timeAgo(thread.createdAt)}
                    </span>
                  </div>
                  <h3>
                    <button
                      type="button"
                      className="thread-title-btn"
                      onClick={() =>
                        setActiveThreadId(activeThreadId === thread.id ? null : thread.id)
                      }
                    >
                      {thread.title}
                    </button>
                  </h3>
                  <p>{thread.body}</p>
                  <div className="thread-actions">
                    <button
                      type="button"
                      className="link"
                      onClick={() =>
                        setActiveThreadId(activeThreadId === thread.id ? null : thread.id)
                      }
                    >
                      {thread.comments.length} comment{thread.comments.length === 1 ? '' : 's'}
                    </button>
                    {isAdmin && (
                      <>
                        <button type="button" className="link" onClick={() => handlePin(thread.id)}>
                          {thread.pinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                          type="button"
                          className="link"
                          onClick={() =>
                            handleStatus(thread.id, thread.status === 'open' ? 'resolved' : 'open')
                          }
                        >
                          Mark {thread.status === 'open' ? 'resolved' : 'open'}
                        </button>
                        <button
                          type="button"
                          className="link danger"
                          onClick={() => handleDelete(thread.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                  {activeThreadId === thread.id && (
                    <div className="comments">
                      {thread.comments.length === 0 && (
                        <p className="muted">No comments yet. Set the tone.</p>
                      )}
                      {thread.comments.map((comment) => (
                        <article key={comment.id} className="comment">
                          <p className="comment-meta">
                            <strong>{comment.author}</strong> · {timeAgo(comment.createdAt)}
                          </p>
                          <p>{comment.body}</p>
                        </article>
                      ))}
                      {isAuthenticated && (
                        <div className="comment-form">
                          <textarea
                            rows="2"
                            value={commentDraft}
                            onChange={(event) => setCommentDraft(event.target.value)}
                            placeholder="Write a comment..."
                          />
                          <button
                            type="button"
                            className="btn btn-dark"
                            onClick={() => handleComment(thread.id)}
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
