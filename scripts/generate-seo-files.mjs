import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const siteUrl = (process.env.VITE_SITE_URL || 'https://cockroachjanthaparty.com').replace(/\/$/, '')
const lastmod = new Date().toISOString().slice(0, 10)

const routes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/protests', changefreq: 'hourly', priority: '1.0' },
  { path: '/complaints/new', changefreq: 'daily', priority: '0.95' },
  { path: '/complaints', changefreq: 'hourly', priority: '0.9' },
  { path: '/community', changefreq: 'hourly', priority: '0.85' },
  { path: '/join', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog', changefreq: 'daily', priority: '0.75' },
  { path: '/complaints/heatmap', changefreq: 'daily', priority: '0.7' },
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route.path === '/' ? '/' : route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /
Allow: /protests
Allow: /complaints
Allow: /complaints/new
Allow: /blog
Allow: /join
Allow: /community
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /reset
Disallow: /profile

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl}
`

const llms = `# Cockroach Janta Party (CJP)

> India's satirical people's movement. Five demands. Zero sponsors. Main Bhi Cockroach.

## Primary pages
- [Home](${siteUrl}/): Movement overview, manifesto, FAQ
- [Join the Protest](${siteUrl}/protests): Register for Jantar Mantar 24/7 protest
- [Police brutality complaint](${siteUrl}/complaints/new?focus=police): Report assault/misbehavior with photo-video proof
- [Public complaints](${siteUrl}/complaints): Civic issue feed
- [Join](${siteUrl}/join): Become a member
- [Blog](${siteUrl}/blog): Party dispatches

## Key facts
- Event: Jantar Mantar, New Delhi, 24/7 peaceful presence
- Demands: Jobs & Accountability, Education Reform, Press Freedom, Judicial Dignity, Transparency Now
- Contact socials: Instagram @cockroachjantaparty, X @Cockroachisback
`

for (const dir of ['public', 'dist']) {
  const targetDir = join(root, dir)
  mkdirSync(targetDir, { recursive: true })
  writeFileSync(join(targetDir, 'sitemap.xml'), sitemap)
  writeFileSync(join(targetDir, 'robots.txt'), robots)
  writeFileSync(join(targetDir, 'llms.txt'), llms)
}

console.log(`SEO files generated for ${siteUrl} (lastmod: ${lastmod})`)
