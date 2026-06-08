import { useHead, useSeoMeta } from '@unhead/react'
import { useLocation } from 'react-router-dom'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  SITE_NAME_HI,
  absoluteUrl,
} from '../lib/site.js'

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  noindex = false,
  canonicalPath,
  jsonLd,
}) {
  const location = useLocation()
  const pathname = canonicalPath || location.pathname
  const canonicalUrl = absoluteUrl(pathname)
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Main Bhi Cockroach | ${SITE_NAME_HI}`
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'

  useSeoMeta({
    title: fullTitle,
    description,
    keywords,
    robots,
    ogType: 'website',
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
    link: [
      { rel: 'canonical', href: canonicalUrl },
      { rel: 'alternate', hreflang: 'en-IN', href: canonicalUrl },
      { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl },
    ],
    script: jsonLdScripts,
  })

  return null
}
