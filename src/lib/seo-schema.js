import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_HI,
  SITE_TAGLINE,
  SOCIAL_LINKS,
} from './site.js'
import { CJP_DEMANDS, OCT10_CAMPAIGN } from './campaign.js'

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: SITE_NAME,
    alternateName: ['CJP', 'Cockroach Janata Party', SITE_NAME_HI],
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/favicon.svg'),
    },
    image: absoluteUrl('/og-image.svg'),
    foundingDate: '2026-05-16',
    slogan: SITE_TAGLINE,
    description: DEFAULT_DESCRIPTION,
    sameAs: SOCIAL_LINKS,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'public inquiries',
      email: 'contact@thecockroachjantaparty.org.in',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: SITE_NAME,
    alternateName: ['CJP', SITE_NAME_HI, 'Main Bhi Cockroach'],
    url: absoluteUrl('/'),
    description: DEFAULT_DESCRIPTION,
    inLanguage: ['en-IN', 'hi-IN'],
    publisher: { '@id': absoluteUrl('/#organization') },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/complaints')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function protestEventJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'CJP Protest — Jantar Mantar',
    description: OCT10_CAMPAIGN.subhead,
    startDate: `${OCT10_CAMPAIGN.eventDate}T00:00:00+05:30`,
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    isAccessibleForFree: true,
    location: {
      '@type': 'Place',
      name: 'Jantar Mantar',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jantar Mantar Road',
        addressLocality: 'New Delhi',
        addressRegion: 'Delhi',
        postalCode: '110001',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 28.6271,
        longitude: 77.2166,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
    url: absoluteUrl('/protests'),
    image: [absoluteUrl('/og-image.svg')],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl('/protests'),
      validFrom: '2026-10-01',
    },
  }
}

export const HOME_FAQS = [
  {
    question: 'What is Cockroach Janta Party (CJP)?',
    answer:
      'Cockroach Janta Party is a satirical people’s movement for India’s overqualified, underemployed youth. Five non-negotiable demands. Zero sponsors. Main Bhi Cockroach.',
  },
  {
    question: 'When and where is the CJP protest?',
    answer: `${OCT10_CAMPAIGN.eventDateLabel} at ${OCT10_CAMPAIGN.venue}. Timing: ${OCT10_CAMPAIGN.timing}. Register on the protests page for in-person or virtual participation.`,
  },
  {
    question: 'What are CJP’s five demands?',
    answer: CJP_DEMANDS.map((d) => `${d.number}. ${d.title}: ${d.text}`).join(' '),
  },
  {
    question: 'How do I report police brutality to CJP?',
    answer:
      'Open the police complaint form, choose assault, harassment, or misbehavior, upload photo or video proof, and submit name, phone, email, and social media privately for follow-up.',
  },
  {
    question: 'Is the Jantar Mantar protest peaceful?',
    answer:
      'Yes. CJP organises peaceful civic presence only. Follow local laws and police directions. Participation is voluntary.',
  },
]

export function homeFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function policeComplaintHowToJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to report police brutality to Cockroach Janta Party',
    description:
      'File a police assault, molestation, or misbehavior complaint with photo/video proof and private contact details.',
    totalTime: 'PT10M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: '0',
    },
    step: [
      {
        '@type': 'HowToStep',
        name: 'Open the police complaint form',
        text: 'Go to /complaints/new?focus=police and log in.',
        url: absoluteUrl('/complaints/new?focus=police'),
      },
      {
        '@type': 'HowToStep',
        name: 'Choose the issue type',
        text: 'Select Police Assault / Beating, Police Sexual Harassment, or Police Misbehavior.',
      },
      {
        '@type': 'HowToStep',
        name: 'Add your private contact details',
        text: 'Enter name, email, phone, and optional Instagram/Facebook/X handles. These stay private.',
      },
      {
        '@type': 'HowToStep',
        name: 'Upload photo or video proof',
        text: 'Attach images or videos of the incident (required for police complaints).',
      },
      {
        '@type': 'HowToStep',
        name: 'Submit and track',
        text: 'Submit the complaint and track status with your reference ID.',
      },
    ],
  }
}
