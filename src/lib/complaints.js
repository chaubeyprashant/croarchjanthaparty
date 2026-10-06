import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db, normalizeDate } from './firebase.js'
import { moderateComplaint } from './moderation.js'
import { createUserNotification } from './notifications.js'

export const ISSUE_TYPES = [
  'Police Assault / Beating',
  'Police Sexual Harassment',
  'Police Misbehavior',
  'Police Misconduct',
  'Corruption',
  'Bribery',
  'Potholes',
  'Road Damage',
  'Water Leakage',
  'Garbage Issue',
  'Construction Defect',
  'Government Negligence',
  'Public Misbehavior',
  'Electricity Issue',
  'Internet/Utility Issue',
  'Other',
]

export const POLICE_ISSUE_TYPES = [
  'Police Assault / Beating',
  'Police Sexual Harassment',
  'Police Misbehavior',
  'Police Misconduct',
]

export const COMPLAINT_STATUSES = [
  'submitted',
  'under_review',
  'verified',
  'escalated',
  'resolved',
  'rejected',
]

export const URGENCY_LEVELS = ['low', 'medium', 'high', 'emergency']

function toReferenceId(docId) {
  return `CJP-${new Date().getFullYear()}-${docId.slice(0, 6).toUpperCase()}`
}

function mapComplaint(docSnap) {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    referenceId: data.referenceId || toReferenceId(docSnap.id),
    issueType: data.issueType || 'Other',
    title: data.title || '',
    description: data.description || '',
    urgency: data.urgency || 'medium',
    status: data.status || 'submitted',
    state: data.location?.state || '',
    city: data.location?.city || '',
    locality: data.location?.area || '',
    address: data.location?.address || '',
    pincode: data.location?.pincode || '',
    location: {
      lat: data.location?.lat || null,
      lng: data.location?.lng || null,
    },
    media: Array.isArray(data.media) ? data.media : [],
    supportCount: data.supportCount || 0,
    commentCount: data.commentCount || 0,
    reporterVisibility: data.reporterVisibility || { anonymous: false },
    reporter: data.reporterPublic || {},
    reporterUserId: data.reporterUserId || null,
    createdAt: normalizeDate(data.createdAt) || new Date().toISOString(),
    updatedAt: normalizeDate(data.updatedAt) || new Date().toISOString(),
    ai: data.ai || {},
  }
}

export async function createComplaint(payload, user) {
  if (!db) throw new Error('Firestore unavailable')
  if (!user?.id) throw new Error('Please log in to submit a complaint.')

  const existing = await getDocs(query(collection(db, 'complaints'), orderBy('createdAt', 'desc')))
  const existingRows = existing.docs.slice(0, 80).map((row) => row.data())
  const ai = moderateComplaint(
    {
      issueType: payload.issueType,
      title: payload.title,
      description: payload.description,
      city: payload.location?.city,
    },
    existingRows,
  )

  const reporterPublic = payload.anonymous
    ? { name: 'Anonymous Citizen' }
    : {
        name: payload.reporter?.name || 'Citizen',
      }

  const complaintRef = doc(collection(db, 'complaints'))
  const referenceId = toReferenceId(complaintRef.id)

  const complaint = {
    referenceId,
    issueType: payload.issueType || 'Other',
    title: payload.title.trim(),
    description: payload.description.trim(),
    incidentDate: payload.incidentDate || null,
    department: payload.department || '',
    officerName: payload.officerName || '',
    estimatedImpact: payload.estimatedImpact || '',
    urgency: payload.urgency || 'medium',
    status: 'submitted',
    location: {
      state: payload.location?.state || '',
      city: payload.location?.city || '',
      area: payload.location?.area || '',
      address: payload.location?.address || '',
      pincode: payload.location?.pincode || '',
      lat: payload.location?.lat || null,
      lng: payload.location?.lng || null,
    },
    reporterVisibility: { anonymous: Boolean(payload.anonymous) },
    reporterPublic,
    reporterUserId: user.id,
    media: Array.isArray(payload.media) ? payload.media : [],
    language: payload.language || 'en',
    voiceTranscript: payload.voiceTranscript || '',
    ai,
    supportCount: 0,
    commentCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  await setDoc(complaintRef, complaint)
  await setDoc(doc(db, 'complaints', complaintRef.id, 'private', 'reporter'), {
    userId: user.id,
    name: payload.reporter?.name || '',
    mobile: payload.reporter?.mobile || '',
    email: payload.reporter?.email || '',
    instagram: payload.reporter?.instagram || '',
    facebook: payload.reporter?.facebook || '',
    twitter: payload.reporter?.twitter || '',
    otherSocial: payload.reporter?.otherSocial || '',
    createdAt: serverTimestamp(),
  })
  
  // Sync the complaint with the user's personal collection
  await setDoc(doc(db, 'users', user.id, 'complaints', complaintRef.id), {
    referenceId,
    title: complaint.title,
    status: complaint.status,
    createdAt: serverTimestamp(),
  })
  await addDoc(collection(db, 'complaints', complaintRef.id, 'statusHistory'), {
    status: 'submitted',
    note: 'Complaint submitted by citizen.',
    changedBy: user?.id || '',
    createdAt: serverTimestamp(),
  })

  await createUserNotification(user.id, {
    type: 'complaint_submitted',
    title: 'Complaint submitted',
    body: ai.needsReview
      ? `${referenceId} is under automated review before public verification.`
      : `${referenceId} is live. Track status anytime.`,
    href: `/complaints/${complaintRef.id}`,
    complaintId: complaintRef.id,
    referenceId,
  })

  return { id: complaintRef.id, referenceId, ai }
}

export function subscribeComplaints(handler, errorHandler) {
  if (!db) return () => {}
  const complaintsQuery = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'))
  return onSnapshot(
    complaintsQuery,
    (snapshot) => handler(snapshot.docs.map(mapComplaint)),
    (error) => errorHandler?.(error),
  )
}

export function subscribeComplaintDetail(complaintId, onData, onError) {
  if (!db || !complaintId) return () => {}
  const complaintRef = doc(db, 'complaints', complaintId)
  return onSnapshot(
    complaintRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null)
        return
      }
      onData(mapComplaint(snapshot))
    },
    (error) => onError?.(error),
  )
}

export function subscribeStatusHistory(complaintId, onData, onError) {
  if (!db || !complaintId) return () => {}
  const statusQuery = query(
    collection(db, 'complaints', complaintId, 'statusHistory'),
    orderBy('createdAt', 'asc'),
  )
  return onSnapshot(
    statusQuery,
    (snapshot) =>
      onData(
        snapshot.docs.map((entry) => {
          const data = entry.data()
          return {
            id: entry.id,
            status: data.status || 'submitted',
            note: data.note || '',
            changedBy: data.changedBy || null,
            createdAt: normalizeDate(data.createdAt) || new Date().toISOString(),
          }
        }),
      ),
    (error) => onError?.(error),
  )
}

export function subscribeComments(complaintId, onData, onError) {
  if (!db || !complaintId) return () => {}
  const commentsQuery = query(collection(db, 'complaints', complaintId, 'comments'), orderBy('createdAt', 'asc'))
  return onSnapshot(
    commentsQuery,
    (snapshot) =>
      onData(
        snapshot.docs.map((comment) => {
          const data = comment.data()
          return {
            id: comment.id,
            authorName: data.authorName || 'Citizen',
            authorId: data.authorId || '',
            body: data.body || '',
            createdAt: normalizeDate(data.createdAt) || new Date().toISOString(),
          }
        }),
      ),
    (error) => onError?.(error),
  )
}

export async function addComplaintComment(complaintId, payload, user) {
  if (!db) return
  await addDoc(collection(db, 'complaints', complaintId, 'comments'), {
    authorName: user?.name || 'Citizen',
    authorId: user?.id || null,
    body: payload.body.trim(),
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'complaints', complaintId), {
    commentCount: increment(1),
    updatedAt: serverTimestamp(),
  })
}

export async function setComplaintSupport(complaintId, userId, shouldSupport) {
  if (!db || !userId) return
  const supportRef = doc(db, 'complaints', complaintId, 'supports', userId)
  if (shouldSupport) {
    await setDoc(supportRef, { createdAt: serverTimestamp() })
    await updateDoc(doc(db, 'complaints', complaintId), {
      supportCount: increment(1),
      updatedAt: serverTimestamp(),
    })
    return
  }
  await deleteDoc(supportRef)
  await updateDoc(doc(db, 'complaints', complaintId), {
    supportCount: increment(-1),
    updatedAt: serverTimestamp(),
  })
}

export function subscribeSupportRecord(complaintId, userId, onData) {
  if (!db || !complaintId || !userId) return () => {}
  return onSnapshot(doc(db, 'complaints', complaintId, 'supports', userId), (snapshot) =>
    onData(snapshot.exists()),
  )
}

export async function getComplaintPrivateReporter(complaintId) {
  if (!db || !complaintId) return null
  const snap = await getDoc(doc(db, 'complaints', complaintId, 'private', 'reporter'))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    name: data.name || '',
    mobile: data.mobile || '',
    email: data.email || '',
    instagram: data.instagram || '',
    facebook: data.facebook || '',
    twitter: data.twitter || '',
    otherSocial: data.otherSocial || '',
  }
}

export async function reportComplaintAsFake(complaintId, payload, user) {
  if (!db) return
  await addDoc(collection(db, 'complaints', complaintId, 'flags'), {
    reporterId: user?.id || null,
    reporterName: user?.name || 'Citizen',
    reason: payload.reason || 'Potentially fake or misleading',
    createdAt: serverTimestamp(),
  })
}

export async function updateComplaintStatus(complaintId, status, note, adminUser, complaintMeta = {}) {
  if (!db) return
  await updateDoc(doc(db, 'complaints', complaintId), {
    status,
    updatedAt: serverTimestamp(),
  })
  await addDoc(collection(db, 'complaints', complaintId, 'statusHistory'), {
    status,
    note: note || '',
    changedBy: adminUser?.id || null,
    createdAt: serverTimestamp(),
  })
  await addDoc(collection(db, 'adminLogs'), {
    action: 'complaint_status_update',
    complaintId,
    status,
    note: note || '',
    adminId: adminUser?.id || null,
    createdAt: serverTimestamp(),
  })

  const reporterUserId = complaintMeta.reporterUserId
  const referenceId = complaintMeta.referenceId || complaintId
  if (reporterUserId) {
    try {
      await updateDoc(doc(db, 'users', reporterUserId, 'complaints', complaintId), {
        status,
        updatedAt: serverTimestamp(),
      })
    } catch {
      /* personal mirror may not exist for older complaints */
    }
    await createUserNotification(reporterUserId, {
      type: 'complaint_status',
      title: `Status: ${String(status).replace('_', ' ')}`,
      body: note?.trim()
        ? `${referenceId} — ${note.trim()}`
        : `${referenceId} was updated to ${String(status).replace('_', ' ')}.`,
      href: `/complaints/${complaintId}`,
      complaintId,
      referenceId,
    })
  }
}
