const rawSiteUrl = import.meta.env.VITE_SITE_URL || 'https://cockroachjanthaparty.com'

export const SITE_URL = rawSiteUrl.replace(/\/$/, '')
export const SITE_NAME = 'Cockroach Janta Party'
export const SITE_NAME_HI = 'कॉकरोच जनता पार्टी'
export const SITE_TAGLINE = 'Five demands. Zero sponsors. One stubborn swarm.'
export const SITE_TWITTER = '@Cockroachisback'
export const SOCIAL_LINKS = [
  'https://www.instagram.com/cockroachjantaparty/',
  'https://x.com/Cockroachisback',
]

export const DEFAULT_TITLE =
  'CJP Protest 10 October Jantar Mantar | Cockroach Janta Party — Main Bhi Cockroach'

export const DEFAULT_DESCRIPTION =
  'Cockroach Janta Party (CJP) — register for the 10 October Jantar Mantar protest (24/7), stand for five non-negotiable demands, report police brutality with photo/video proof, and join India’s youth accountability movement. Main Bhi Cockroach.'

export const DEFAULT_KEYWORDS = [
  // Brand
  'Cockroach Janta Party',
  'Cockroach Janata Party',
  'CJP India',
  'CJP protest',
  'CJP protest today',
  'CJP latest news',
  'कॉकरोच जनता पार्टी',
  'Main Bhi Cockroach',
  'मैं भी कॉकरोच',
  '#CJP',
  '#MainBhiCockroach',
  // Oct 10 campaign
  '10 October protest',
  '10 October Jantar Mantar',
  'Jantar Mantar protest',
  'Jantar Mantar protest today',
  'Delhi protest 10 October',
  'Delhi protest today',
  'CJP Jantar Mantar',
  'register for protest Delhi',
  'youth protest India 2026',
  // Accountability themes
  'CEC accountability',
  'Gyanesh Kumar protest',
  'SIR electoral rolls',
  'voter deletion protest',
  'election commission protest Delhi',
  // Demands / issues
  'youth unemployment India',
  'NEET paper leak protest',
  'education reform India',
  'press freedom India',
  'PM CARES transparency',
  'CJP manifesto',
  'CJP five demands',
  // Complaints
  'police brutality complaint India',
  'report police assault',
  'police misbehavior complaint',
  'police molestation complaint',
  'civic complaint India',
  'corruption reporting India',
  'file complaint with photo evidence',
].join(', ')

export const PROTEST_KEYWORDS = [
  'CJP protest 10 October',
  'Jantar Mantar protest 10 October',
  'Jantar Mantar 24/7 protest',
  'register CJP protest',
  'Delhi protest registration',
  'Cockroach Janta Party protest',
  'Main Bhi Cockroach protest',
  'CEC resignation protest',
  'SIR protest Delhi',
  'youth march Delhi',
  'peaceful protest Jantar Mantar',
].join(', ')

export const COMPLAINT_KEYWORDS = [
  'police brutality complaint India',
  'report police beating',
  'police assault complaint with video',
  'police sexual harassment complaint',
  'police misbehavior report',
  'upload police brutality proof',
  'civic complaint form India',
  'corruption complaint online',
  'anonymous civic complaint',
  'CJP complaints',
].join(', ')

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`
export const DEFAULT_OG_IMAGE_ALT = 'Cockroach Janta Party — 10 October Jantar Mantar | Main Bhi Cockroach'

export const PUBLIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/protests', changefreq: 'hourly', priority: '1.0' },
  { path: '/community', changefreq: 'hourly', priority: '0.9' },
  { path: '/complaints', changefreq: 'hourly', priority: '0.9' },
  { path: '/complaints/new', changefreq: 'daily', priority: '0.9' },
  { path: '/complaints/heatmap', changefreq: 'daily', priority: '0.7' },
  { path: '/join', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog', changefreq: 'daily', priority: '0.7' },
]

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
