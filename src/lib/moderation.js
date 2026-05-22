const ABUSIVE_TERMS = ['idiot', 'stupid', 'hate', 'kill', 'bloody', 'moron', 'scamster']
const SPAM_PATTERNS = [/http[s]?:\/\//gi, /free money/gi, /click here/gi, /(.)\1{6,}/g]

const CATEGORY_KEYWORDS = {
  Corruption: ['corruption', 'rishwat', 'bribe', 'ghoos', 'kickback'],
  Bribery: ['bribe', 'ghoos', 'cash demand'],
  Potholes: ['pothole', 'khadda', 'road pit'],
  'Road Damage': ['road crack', 'road damage', 'broken road', 'damaged road'],
  'Water Leakage': ['water leak', 'pipeline leak', 'sewage leak'],
  'Garbage Issue': ['garbage', 'trash', 'kuda', 'waste dump'],
  'Construction Defect': ['construction defect', 'poor material', 'collapsed wall'],
  'Government Negligence': ['negligence', 'official ignored', 'no action'],
  'Public Misbehavior': ['harassment', 'public abuse', 'fight'],
  'Police Misconduct': ['police misconduct', 'extortion', 'custody abuse'],
  'Electricity Issue': ['power cut', 'electricity', 'voltage', 'transformer'],
  'Internet/Utility Issue': ['internet down', 'fiber cut', 'utility failure'],
}

function countMatches(text, items) {
  return items.reduce((acc, item) => (text.includes(item) ? acc + 1 : acc), 0)
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
  const text = `${input.title || ''} ${input.description || ''}`.trim().toLowerCase()
  const abusiveCount = countMatches(text, ABUSIVE_TERMS)
  const spamHits = SPAM_PATTERNS.reduce((acc, pattern) => acc + ((text.match(pattern) || []).length > 0 ? 1 : 0), 0)
  const duplicate = existingComplaints.some((row) => {
    const title = (row.title || '').toLowerCase()
    const sameCity = (row.city || '').toLowerCase() === (input.city || '').toLowerCase()
    return title && sameCity && (text.includes(title) || title.includes(text.slice(0, 30)))
  })
  const category = classifyComplaint(input)

  return {
    abusiveCount,
    spamScore: Math.min(1, spamHits * 0.3),
    duplicate,
    suggestedIssueType: category.issueType,
    confidence: category.confidence,
    needsReview: abusiveCount > 0 || spamHits > 1 || duplicate,
  }
}
