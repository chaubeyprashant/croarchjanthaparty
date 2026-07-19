import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db, isFirebaseConfigured, normalizeDate } from '../lib/firebase.js'

const STATIC_ARTICLES = [
  {
    id: 'vision-2026',
    title: 'The Cockroach Vision: Surviving the Apocalypse of Corruption',
    excerpt: 'Our founding manifesto detailing how we plan to eradicate corruption and rebuild our cities from the ground up, much like a cockroach survives a nuclear fallout.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    authorName: 'Prashant Chaubey',
  },
  {
    id: 'infrastructure-decay',
    title: 'Why Our Roads Look Like The Moon (And How To Fix It)',
    excerpt: 'An in-depth analysis of the current infrastructure decay, contractor mafias, and our 3-step plan to ensure roads last more than a single monsoon.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    authorName: 'Prashant Chaubey',
  },
]

export function Articles() {
  const [articles, setArticles] = useState(STATIC_ARTICLES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      if (!isFirebaseConfigured || !db) {
        setLoading(false)
        return
      }
      try {
        const q = query(collection(db, 'articles'), orderBy('publishedAt', 'desc'))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          setArticles(docs)
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  return (
    <>
      <section className="section bg-ink text-paper">
        <div className="section-content text-center">
          <h1 className="condensed hero-title">PARTY DISPATCHES</h1>
          <p className="hero-subtitle">
            News, manifestos, and truth bombs from the Cockroach Janta Party.
          </p>
        </div>
      </section>

      <section className="section bg-paper text-ink">
        <div className="section-content">
          {loading ? (
            <div className="text-center" style={{ padding: '4rem 0', opacity: 0.7 }}>Loading dispatches...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {articles.map(article => (
                <Link to={`/blog/${article.id}`} key={article.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ border: '2px solid var(--ink)', borderRadius: '8px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', backgroundColor: '#fff' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                    <div style={{ height: '200px', backgroundColor: '#eee', backgroundImage: `url(${article.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '2px solid var(--ink)' }} />
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="condensed" style={{ color: 'var(--red)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        {new Date(normalizeDate(article.publishedAt)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h2 className="condensed" style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', lineHeight: 1.2 }}>{article.title}</h2>
                      <p style={{ margin: '0 0 1.5rem 0', opacity: 0.8, fontSize: '0.95rem', flex: 1 }}>{article.excerpt}</p>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>By {article.authorName}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
