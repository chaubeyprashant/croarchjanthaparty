import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const siteUrl = (process.env.VITE_SITE_URL || 'https://cockroachjanthaparty.com').replace(/\/$/, '')
const lastmod = new Date().toISOString().slice(0, 10)

const routes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/community', changefreq: 'hourly', priority: '0.9' },
  { path: '/complaints', changefreq: 'hourly', priority: '0.9' },
  { path: '/complaints/new', changefreq: 'weekly', priority: '0.8' },
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
Disallow: /admin
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`

for (const dir of ['public', 'dist']) {
  const targetDir = join(root, dir)
  mkdirSync(targetDir, { recursive: true })
  writeFileSync(join(targetDir, 'sitemap.xml'), sitemap)
  writeFileSync(join(targetDir, 'robots.txt'), robots)
}

console.log(`SEO files generated for ${siteUrl} (lastmod: ${lastmod})`)
