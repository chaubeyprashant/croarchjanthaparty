import { useHead, useSeoMeta } from '@unhead/react'
import { useLocation } from 'react-router-dom'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_TWITTER,
  absoluteUrl,
} from '../lib/site.js'

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  noindex = false,
  canonicalPath,
  jsonLd,
  type = 'website',
}) {
  const location = useLocation()
  const pathname = canonicalPath || location.pathname
  const canonicalUrl = absoluteUrl(pathname)
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const robots = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

  useSeoMeta({
    title: fullTitle,
    description,
    keywords,
    robots,
    author: SITE_NAME,
    ogType: type,
    ogSiteName: SITE_NAME,
    ogUrl: canonicalUrl,
    ogTitle: fullTitle,
    ogDescription: description,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_IMAGE_ALT,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageType: 'image/svg+xml',
    ogLocale: 'en_IN',
    twitterCard: 'summary_large_image',
    twitterSite: SITE_TWITTER,
    twitterCreator: SITE_TWITTER,
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: DEFAULT_OG_IMAGE,
    twitterImageAlt: DEFAULT_OG_IMAGE_ALT,
  })

  const jsonLdScripts = (Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []).map((schema) => ({
    type: 'application/ld+json',
    textContent: JSON.stringify(schema),
  }))

  useHead({
    htmlAttrs: { lang: 'en-IN' },
    meta: [
      { property: 'og:locale:alternate', content: 'hi_IN' },
      { name: 'geo.region', content: 'IN-DL' },
      { name: 'geo.placename', content: 'New Delhi' },
      { name: 'geo.position', content: '28.6271;77.2166' },
      { name: 'ICBM', content: '28.6271, 77.2166' },
      { name: 'language', content: 'English' },
      { name: 'revisit-after', content: '1 days' },
      { name: 'rating', content: 'general' },
      { name: 'distribution', content: 'global' },
      { name: 'category', content: 'Politics, Activism, Civic Tech' },
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl },
      { rel: 'alternate', hreflang: 'en-IN', href: canonicalUrl },
      { rel: 'alternate', hreflang: 'hi-IN', href: canonicalUrl },
      { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl },
      { rel: 'sitemap', type: 'application/xml', href: absoluteUrl('/sitemap.xml') },
    ],
    script: jsonLdScripts,
  })

  return null
}
