import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  limit,
  writeBatch,
  getDocs,
} from 'firebase/firestore'
import { db, normalizeDate } from './firebase.js'

function mapNotification(snap) {
  const data = snap.data()
  return {
    id: snap.id,
    type: data.type || 'info',
    title: data.title || 'Update',
    body: data.body || '',
    href: data.href || '',
    read: Boolean(data.read),
    complaintId: data.complaintId || null,
    referenceId: data.referenceId || null,
    createdAt: normalizeDate(data.createdAt) || new Date().toISOString(),
  }
}

export async function createUserNotification(userId, payload) {
  if (!db || !userId) return null
  const ref = await addDoc(collection(db, 'users', userId, 'notifications'), {
    type: payload.type || 'info',
    title: payload.title || 'Update',
    body: payload.body || '',
    href: payload.href || '',
    read: false,
    complaintId: payload.complaintId || null,
    referenceId: payload.referenceId || null,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export function subscribeUserNotifications(userId, onData, onError) {
  if (!db || !userId) return () => {}
  const notificationsQuery = query(
    collection(db, 'users', userId, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(40),
  )
  return onSnapshot(
    notificationsQuery,
    (snapshot) => onData(snapshot.docs.map(mapNotification)),
    (error) => onError?.(error),
  )
}

export async function markNotificationRead(userId, notificationId) {
  if (!db || !userId || !notificationId) return
  await updateDoc(doc(db, 'users', userId, 'notifications', notificationId), { read: true })
}

export async function markAllNotificationsRead(userId, notificationIds = []) {
  if (!db || !userId) return
  if (notificationIds.length > 0) {
    const batch = writeBatch(db)
    notificationIds.forEach((id) => {
      batch.update(doc(db, 'users', userId, 'notifications', id), { read: true })
    })
    await batch.commit()
    return
  }
  const unreadQuery = query(
    collection(db, 'users', userId, 'notifications'),
    where('read', '==', false),
    limit(40),
  )
  const snapshot = await getDocs(unreadQuery)
  if (snapshot.empty) return
  const batch = writeBatch(db)
  snapshot.docs.forEach((entry) => {
    batch.update(entry.ref, { read: true })
  })
  await batch.commit()
}
