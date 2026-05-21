import { useHead, useSeoMeta } from '@unhead/react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'Cockroach Janta Party'
const BASE_URL = 'https://cockroachjantaparty.org'
const DEFAULT_DESCRIPTION =
  'A youth-led political movement for the people the system forgot to count. Five demands. Zero sponsors. Join, donate, and organize.'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.svg`
const DEFAULT_IMAGE_ALT = 'Cockroach Janta Party social preview'

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  noindex = false,
  canonicalPath,
  jsonLd,
}) {
  const location = useLocation()
  const pathname = canonicalPath || location.pathname
  const canonicalUrl = `${BASE_URL}${pathname}`
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Voice of the Lazy & Unemployed`
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

  useSeoMeta({
    title: fullTitle,
    description,
    keywords: keywords || undefined,
    robots,
    ogType: 'website',
    ogSiteName: SITE_NAME,
    ogUrl: canonicalUrl,
    ogTitle: fullTitle,
    ogDescription: description,
    ogImage: DEFAULT_IMAGE,
    ogImageAlt: DEFAULT_IMAGE_ALT,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageType: 'image/svg+xml',
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: DEFAULT_IMAGE,
    twitterImageAlt: DEFAULT_IMAGE_ALT,
  })

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: jsonLd
      ? [
          {
            type: 'application/ld+json',
            textContent: JSON.stringify(jsonLd),
          },
        ]
      : [],
  })

  return null
}
