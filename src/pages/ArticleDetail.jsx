import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured, normalizeDate } from '../lib/firebase.js'
import { ArrowLeft } from 'lucide-react'

const STATIC_ARTICLES = {
  'vision-2026': {
    title: 'The Cockroach Vision: Surviving the Apocalypse of Corruption',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    authorName: 'Prashant Chaubey',
    content: `
Our political system is broken. It has been nuked by corruption, greed, and nepotism. But you know what survives a nuclear fallout? **Cockroaches.**

We are the Cockroach Janta Party. We are resilient, we are everywhere, and we refuse to die out. For decades, the elite have tried to stamp us out, treating the common citizen like pests. Well, it's time the pests took over the house.

### Our 3-Point Manifesto

1. **Radical Transparency**: Every rupee spent by the government will be tracked on a public blockchain ledger. If a road costs 50 lakhs, you will know exactly whose pocket every single rupee went into.
2. **Citizen Audits**: No project is passed until a random lottery of local citizens signs off on the quality. If the bridge collapses in a month, the contractor doesn't just lose their license—they lose their assets.
3. **Pest Control**: We will fumigate the political system. Term limits for all, no more dynastic politics, and a strict ban on politicians with serious criminal records holding office.

Join us. We are indestructible. We are the future.
    `,
  },
  'infrastructure-decay': {
    title: 'Why Our Roads Look Like The Moon (And How To Fix It)',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    authorName: 'Prashant Chaubey',
    content: `
Have you ever driven down the street and wondered if you suddenly joined the Apollo space program? The craters on our roads are not natural phenomena; they are the result of a deeply entrenched contractor mafia.

### The Problem

Every monsoon, the roads wash away. Not because water is magic, but because the tar used is mixed with inferior materials. The contractor saves money, the inspector gets a bribe, and you get a busted suspension.

### The Cockroach Solution

1. **Warranty Periods**: Any contractor building a road must provide a 5-year mandatory warranty. If a pothole appears within 5 years, they fix it out of their own pocket within 48 hours.
2. **Open Source Materials Testing**: We will establish independent, citizen-led testing labs. Before a bill is cleared, the core sample of the road must pass a live-streamed stress test.

We can't keep paying taxes for roads that wash away like chalk. It's time to build infrastructure that survives, just like us.
    `,
  }
}

export function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchArticle() {
      if (!isFirebaseConfigured || !db) {
        if (STATIC_ARTICLES[id]) {
          setArticle({ id, ...STATIC_ARTICLES[id] })
        } else {
          setError('Article not found.')
        }
        setLoading(false)
        return
      }

      try {
        const docRef = doc(db, 'articles', id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() })
        } else if (STATIC_ARTICLES[id]) {
          // Fallback to static if not in DB yet
          setArticle({ id, ...STATIC_ARTICLES[id] })
        } else {
          setError('Article not found.')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load article.')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  if (loading) {
    return <div className="section text-center" style={{ padding: '8rem 0' }}>Loading...</div>
  }

  if (error || !article) {
    return (
      <div className="section text-center" style={{ padding: '8rem 0' }}>
        <h2 className="condensed">{error || 'Article not found.'}</h2>
        <Link to="/articles" className="btn-join condensed bg-ink text-paper" style={{ marginTop: '2rem', display: 'inline-block' }}>BACK TO DISPATCHES</Link>
      </div>
    )
  }

  return (
    <div className="bg-paper text-ink" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ height: '40vh', minHeight: '300px', backgroundColor: '#eee', backgroundImage: `url(${article.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
      </div>
      
      <div className="container" style={{ maxWidth: '800px', marginTop: '-100px', position: 'relative', zIndex: 10 }}>
        <div className="bg-paper border-ink p-8" style={{ padding: '3rem' }}>
          <Link to="/articles" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--red)', fontWeight: 'bold', marginBottom: '2rem' }} className="condensed">
            <ArrowLeft size={16} /> BACK TO ALL ARTICLES
          </Link>
          
          <div className="condensed" style={{ color: 'var(--red)', fontSize: '1.1rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
            {new Date(normalizeDate(article.publishedAt)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          
          <h1 className="condensed hero-title" style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            {article.title}
          </h1>
          
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '3rem', borderBottom: '2px solid var(--ink)', paddingBottom: '1.5rem' }}>
            By {article.authorName}
          </div>
          
          <div className="article-content" style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            {article.content.split('\n').map((paragraph, i) => {
              if (!paragraph.trim()) return null
              if (paragraph.startsWith('###')) {
                return <h3 key={i} className="condensed" style={{ fontSize: '2rem', marginTop: '2.5rem', marginBottom: '1rem' }}>{paragraph.replace('### ', '')}</h3>
              }
              if (paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.')) {
                // simple bold parsing for lists
                const parts = paragraph.split('**')
                return (
                  <p key={i} style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                    {parts.map((part, index) => index % 2 === 1 ? <strong key={index}>{part}</strong> : part)}
                  </p>
                )
              }
              
              // simple bold parsing for paragraphs
              const parts = paragraph.split('**')
              return (
                <p key={i} style={{ marginBottom: '1.5rem' }}>
                  {parts.map((part, index) => index % 2 === 1 ? <strong key={index}>{part}</strong> : part)}
                </p>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
