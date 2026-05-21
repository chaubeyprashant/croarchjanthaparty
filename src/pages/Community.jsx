import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { useAuth } from '../context/auth-context.js'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'
import { db, firebaseConfigError, isFirebaseConfigured, normalizeDate } from '../lib/firebase.js'

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
  const [threads, setThreads] = useState([])
  const [backendError, setBackendError] = useState(() =>
    isFirebaseConfigured ? '' : firebaseConfigError(),
  )
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('top')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState({ title: '', body: '', category: 'General' })
  const [activeThreadId, setActiveThreadId] = useState(null)
  const [commentDraft, setCommentDraft] = useState('')

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return undefined
    const threadsQuery = collection(db, 'threads')
    return onSnapshot(
      threadsQuery,
      (snapshot) => {
        const mapped = snapshot.docs.map((docSnap) => {
          const data = docSnap.data()
          return {
            id: docSnap.id,
            title: data.title || '',
            body: data.body || '',
            category: data.category || 'General',
            author: data.author || 'Member',
            authorId: data.authorId || '',
            createdAt: normalizeDate(data.createdAt) || new Date().toISOString(),
            pinned: Boolean(data.pinned),
            status: data.status || 'open',
            votes: data.votes || 0,
            comments: Array.isArray(data.comments) ? data.comments : [],
          }
        })
        setThreads(mapped)
        setBackendError('')
      },
      () => {
        setBackendError('Unable to load forum threads from Firebase.')
      },
    )
  }, [])

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

  const handlePost = async (event) => {
    event.preventDefault()
    if (!isAuthenticated || !isFirebaseConfigured || !db) return
    if (!draft.title.trim() || !draft.body.trim()) return
    const thread = {
      title: draft.title.trim(),
      body: draft.body.trim(),
      category: draft.category,
      author: user.name,
      authorId: user.id,
      pinned: false,
      status: 'open',
      votes: 1,
      comments: [],
      createdAt: serverTimestamp(),
    }
    try {
      await addDoc(collection(db, 'threads'), thread)
      setDraft({ title: '', body: '', category: 'General' })
    } catch {
      setBackendError('Unable to post thread right now.')
    }
  }

  const handleVote = async (threadId, delta) => {
    if (!db) return
    try {
      await updateDoc(doc(db, 'threads', threadId), { votes: increment(delta) })
    } catch {
      setBackendError('Unable to update votes right now.')
    }
  }

  const handleComment = async (threadId) => {
    if (!commentDraft.trim() || !isAuthenticated || !db) return
    const comment = {
      id: `c-${Date.now().toString(36)}`,
      author: user.name,
      authorId: user.id,
      body: commentDraft.trim(),
      createdAt: new Date().toISOString(),
    }
    try {
      await updateDoc(doc(db, 'threads', threadId), {
        comments: arrayUnion(comment),
      })
      setCommentDraft('')
    } catch {
      setBackendError('Unable to post comment right now.')
    }
  }

  const handleStatus = async (threadId, status) => {
    if (!db) return
    try {
      await updateDoc(doc(db, 'threads', threadId), { status })
    } catch {
      setBackendError('Unable to update thread status.')
    }
  }

  const handlePin = async (threadId, pinned) => {
    if (!db) return
    try {
      await updateDoc(doc(db, 'threads', threadId), { pinned: !pinned })
    } catch {
      setBackendError('Unable to pin thread right now.')
    }
  }

  const handleDelete = async (threadId) => {
    if (!db) return
    try {
      await deleteDoc(doc(db, 'threads', threadId))
      if (activeThreadId === threadId) setActiveThreadId(null)
    } catch {
      setBackendError('Unable to delete thread right now.')
    }
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
        {backendError && <p className="auth-error">{backendError}</p>}
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
                        <button
                          type="button"
                          className="link"
                          onClick={() => handlePin(thread.id, thread.pinned)}
                        >
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
