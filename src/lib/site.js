const rawSiteUrl = import.meta.env.VITE_SITE_URL || 'https://cockroachjanthaparty.com'

export const SITE_URL = rawSiteUrl.replace(/\/$/, '')
export const SITE_NAME = 'Cockroach Janta Party'
export const SITE_NAME_HI = 'कॉकरोच जनता पार्टी'
export const SITE_TAGLINE = 'Five demands. Zero sponsors. One stubborn swarm.'
export const DEFAULT_DESCRIPTION =
  'Cockroach Janta Party (CJP) — India\'s satirical people\'s movement. Five demands, zero sponsors. Join the swarm, read the manifesto, file civic complaints, and organize.'
export const DEFAULT_KEYWORDS =
  'Cockroach Janta Party, Cockroach Janata Party, CJP India, कॉकरोच जनता पार्टी, Main Bhi Cockroach, मैं भी कॉकरोच, youth movement India, political satire, manifesto, civic complaints, corruption reporting India'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`
export const DEFAULT_OG_IMAGE_ALT = 'Cockroach Janta Party — Main Bhi Cockroach'

export const PUBLIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/community', changefreq: 'hourly', priority: '0.9' },
  { path: '/complaints', changefreq: 'hourly', priority: '0.9' },
  { path: '/complaints/new', changefreq: 'weekly', priority: '0.8' },
  { path: '/complaints/heatmap', changefreq: 'daily', priority: '0.7' },
]

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
