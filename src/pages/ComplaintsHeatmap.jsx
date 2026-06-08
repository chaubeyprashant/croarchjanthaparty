import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal.jsx'
import { Seo } from '../components/Seo.jsx'
import { breadcrumbJsonLd } from '../lib/seo-schema.js'
import { subscribeComplaints } from '../lib/complaints.js'

function groupHotspots(rows) {
  const bucket = new Map()
  rows.forEach((row) => {
    if (!row.location?.lat || !row.location?.lng) return
    const key = `${Number(row.location.lat).toFixed(2)},${Number(row.location.lng).toFixed(2)}`
    const current = bucket.get(key) || {
      key,
      count: 0,
      cities: new Set(),
      urgent: 0,
      sample: row,
    }
    current.count += 1
    if (row.urgency === 'high' || row.urgency === 'emergency') current.urgent += 1
    current.cities.add(row.city)
    bucket.set(key, current)
  })
  return [...bucket.values()]
    .map((item) => ({ ...item, cities: [...item.cities] }))
    .sort((a, b) => b.count - a.count)
}

export function ComplaintsHeatmap() {
  const [complaints, setComplaints] = useState([])
  const [backendError, setBackendError] = useState('')

  useEffect(
    () =>
      subscribeComplaints(
        (rows) => {
          setComplaints(rows)
          setBackendError('')
        },
        () => setBackendError('Unable to load hotspot data right now.'),
      ),
    [],
  )

  const hotspots = useMemo(() => groupHotspots(complaints), [complaints])
  const top = hotspots[0]?.sample
  const mapSrc =
    top?.location?.lat && top?.location?.lng
      ? `https://www.google.com/maps?q=${top.location.lat},${top.location.lng}&z=12&output=embed`
      : ''

  return (
    <>
      <Seo
        title="Civic Heatmap — Complaint Hotspots in India"
        description="Live civic heatmap showing corruption hotspots, pothole clusters, and high-complaint zones across Indian cities."
        keywords="civic heatmap India, corruption hotspots map, complaint clusters, pothole map India, public accountability dashboard"
        canonicalPath="/complaints/heatmap"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Public Complaints', path: '/complaints' },
          { name: 'Civic Heatmap', path: '/complaints/heatmap' },
        ])}
      />
      <section className="section page-head">
        <Reveal as="p" className="eyebrow">
          Civic Heatmap
        </Reveal>
        <Reveal as="h1" delay={60}>
          Hotspots, clusters, and <em className="accent-orange">high-risk zones.</em>
        </Reveal>
        <Reveal as="p" className="lead" delay={120}>
          A live civic intensity board built from user complaints. Areas with repeated reports and
          urgent issues surface on top.
        </Reveal>
        <Reveal className="hero-actions" delay={140}>
          <Link to="/complaints" className="btn btn-ghost">
            Back to complaints
          </Link>
        </Reveal>
      </section>

      <section className="section complaint-detail-layout">
        <Reveal className="rules-card">
          <h3>Live hotspot map preview</h3>
          {mapSrc ? (
            <iframe title="Civic hotspots map" src={mapSrc} className="map-frame" loading="lazy" />
          ) : (
            <p className="muted">No geo-tagged complaints yet. Add location while filing complaints.</p>
          )}
        </Reveal>
        <Reveal className="admin-card" delay={80}>
          <h2>Hotspot leaderboard</h2>
          {backendError && <p className="auth-error">{backendError}</p>}
          {hotspots.length === 0 ? (
            <p className="muted">No clustered locations yet.</p>
          ) : (
            <ul className="mod-list">
              {hotspots.slice(0, 20).map((spot) => (
                <li key={spot.key}>
                  <div>
                    <strong>{spot.key}</strong>
                    <small>{spot.cities.filter(Boolean).join(', ') || 'Unknown city cluster'}</small>
                  </div>
                  <div className="thread-actions">
                    <span className="status-pill">{spot.count} reports</span>
                    <span className="status-pill">{spot.urgent} urgent</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </section>
    </>
  )
}
