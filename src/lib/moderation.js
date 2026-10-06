const ABUSIVE_TERMS = [
  'idiot',
  'stupid',
  'hate',
  'kill',
  'bloody',
  'moron',
  'scamster',
  'harami',
  'madarchod',
  'bhosdike',
  'chutiya',
]

const FRAUD_TERMS = [
  'send money',
  'upi id',
  'paytm',
  'whatsapp me',
  'guaranteed job',
  'lottery',
  'crypto giveaway',
  'click here',
  'free money',
]

const SPAM_PATTERNS = [
  /http[s]?:\/\//gi,
  /free money/gi,
  /click here/gi,
  /(.)\1{6,}/g,
  /\b\d{10}\b/g,
  /@[a-z0-9._%+-]+\.[a-z]{2,}/gi,
]

const CATEGORY_KEYWORDS = {
  Corruption: ['corruption', 'rishwat', 'bribe', 'ghoos', 'kickback', 'भ्रष्टाचार'],
  Bribery: ['bribe', 'ghoos', 'cash demand', 'रिश्वत'],
  Potholes: ['pothole', 'khadda', 'road pit', 'गड्ढा'],
  'Road Damage': ['road crack', 'road damage', 'broken road', 'damaged road'],
  'Water Leakage': ['water leak', 'pipeline leak', 'sewage leak', 'पानी लीक'],
  'Garbage Issue': ['garbage', 'trash', 'kuda', 'waste dump', 'कचरा'],
  'Construction Defect': ['construction defect', 'poor material', 'collapsed wall'],
  'Government Negligence': ['negligence', 'official ignored', 'no action'],
  'Public Misbehavior': ['harassment', 'public abuse', 'fight'],
  'Police Misconduct': ['police misconduct', 'extortion', 'custody abuse', 'पुलिस'],
  'Police Assault / Beating': ['beaten', 'beating', 'lathi', 'assault', 'थप्पड़', 'मारपीट', 'police beat'],
  'Police Sexual Harassment': ['molest', 'harass', 'sexual', 'touch', 'छेडछाड़', 'दुष्कर्म'],
  'Police Misbehavior': ['misbehave', 'rude police', 'abusive police', 'गाली', 'बदतमीजी'],
  'Electricity Issue': ['power cut', 'electricity', 'voltage', 'transformer'],
  'Internet/Utility Issue': ['internet down', 'fiber cut', 'utility failure'],
}

function countMatches(text, items) {
  return items.reduce((acc, item) => (text.includes(item) ? acc + 1 : acc), 0)
}

function tokenize(text) {
  return new Set(
    String(text || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2),
  )
}

export function similarityScore(a, b) {
  const left = tokenize(a)
  const right = tokenize(b)
  if (left.size === 0 || right.size === 0) return 0
  let overlap = 0
  left.forEach((token) => {
    if (right.has(token)) overlap += 1
  })
  return overlap / Math.max(left.size, right.size)
}

export function classifyComplaint(input = {}) {
  const source = `${input.title || ''} ${input.description || ''}`.toLowerCase()
  let bestType = input.issueType || 'Other'
  let bestScore = 0

  Object.entries(CATEGORY_KEYWORDS).forEach(([type, keywords]) => {
    const score = countMatches(source, keywords)
    if (score > bestScore) {
      bestType = type
      bestScore = score
    }
  })

  return { issueType: bestType, confidence: Math.min(0.95, bestScore * 0.22) }
}

export function moderateComplaint(input = {}, existingComplaints = []) {
  const title = String(input.title || '').trim().toLowerCase()
  const description = String(input.description || '').trim().toLowerCase()
  const text = `${title} ${description}`.trim()
  const city = String(input.city || '').toLowerCase()

  const abusiveCount = countMatches(text, ABUSIVE_TERMS)
  const fraudCount = countMatches(text, FRAUD_TERMS)
  const spamHits = SPAM_PATTERNS.reduce(
    (acc, pattern) => acc + ((text.match(pattern) || []).length > 0 ? 1 : 0),
    0,
  )

  let bestDuplicateScore = 0
  let duplicateOf = null
  existingComplaints.forEach((row) => {
    const sameCity = !city || (row.city || row.location?.city || '').toLowerCase() === city
    if (!sameCity) return
    const candidate = `${row.title || ''} ${row.description || ''}`
    const score = similarityScore(text, candidate)
    if (score > bestDuplicateScore) {
      bestDuplicateScore = score
      duplicateOf = row.referenceId || row.id || null
    }
  })

  const duplicate = bestDuplicateScore >= 0.55
  const tooShort = title.length < 5 || description.length < 20
  const category = classifyComplaint(input)
  const riskScore = Math.min(
    1,
    abusiveCount * 0.25 + fraudCount * 0.3 + spamHits * 0.2 + (duplicate ? 0.35 : 0) + (tooShort ? 0.15 : 0),
  )

  const flags = []
  if (abusiveCount > 0) flags.push('abusive_language')
  if (fraudCount > 0) flags.push('possible_fraud')
  if (spamHits > 1) flags.push('spam_patterns')
  if (duplicate) flags.push('likely_duplicate')
  if (tooShort) flags.push('thin_content')

  return {
    abusiveCount,
    fraudCount,
    spamScore: Math.min(1, spamHits * 0.3),
    duplicate,
    duplicateScore: Number(bestDuplicateScore.toFixed(2)),
    duplicateOf,
    suggestedIssueType: category.issueType,
    confidence: category.confidence,
    riskScore: Number(riskScore.toFixed(2)),
    flags,
    needsReview: flags.length > 0 || riskScore >= 0.35,
  }
}
