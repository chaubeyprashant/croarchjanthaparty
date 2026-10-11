import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured, normalizeDate } from './firebase.js'

export const DEV_SUPPORTERS_COLLECTION = 'dev_supporters'

/**
 * Record details of a user who paid / contributed through Support the Dev
 */
export async function recordDevSupport({
  name,
  email,
  phone = '',
  amount,
  currency = 'INR',
  method = 'upi',
  transactionId = '',
  message = '',
  userId = null,
}) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Database is not configured.')
  }

  const cleanName = (name || '').trim()
  if (!cleanName) {
    throw new Error('Please provide your name.')
  }

  const numericAmount = Number(amount)
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error('Please provide a valid amount.')
  }

  const docData = {
    name: cleanName,
    email: (email || '').trim().toLowerCase(),
    phone: (phone || '').trim(),
    amount: numericAmount,
    currency: (currency || 'INR').toUpperCase(),
    method: (method || 'upi').toLowerCase(),
    transactionId: (transactionId || '').trim(),
    message: (message || '').trim(),
    userId: userId || null,
    status: 'submitted',
    createdAt: serverTimestamp(),
  }

  // 1. Save to the primary dev_supporters collection
  const docRef = await addDoc(collection(db, DEV_SUPPORTERS_COLLECTION), docData)

  // 2. Also mirror to the legacy/general donations collection for cross-compatibility
  try {
    await addDoc(collection(db, 'donations'), {
      donor: cleanName,
      email: docData.email,
      phone: docData.phone,
      amount: numericAmount,
      currency: docData.currency,
      method: docData.method,
      transactionId: docData.transactionId,
      message: docData.message,
      supporterDocId: docRef.id,
      recurring: false,
      userId: userId || null,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    // Non-fatal if legacy collection rules fail
    console.warn('Could not mirror to legacy donations collection:', err)
  }

  return { id: docRef.id, ...docData }
}

/**
 * Real-time listener for dev supporters (Admin / Dashboard use)
 */
export function subscribeDevSupporters(onData, onError, maxItems = 100) {
  if (!isFirebaseConfigured || !db) {
    if (onError) onError(new Error('Firebase not configured'))
    return () => {}
  }

  const q = query(
    collection(db, DEV_SUPPORTERS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(maxItems),
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const supporters = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          name: data.name || data.donor || 'Anonymous',
          email: data.email || '',
          phone: data.phone || '',
          amount: Number(data.amount) || 0,
          currency: data.currency || 'INR',
          method: data.method || 'upi',
          transactionId: data.transactionId || '',
          message: data.message || '',
          userId: data.userId || null,
          status: data.status || 'submitted',
          createdAt: normalizeDate(data.createdAt) || new Date().toISOString(),
        }
      })
      onData(supporters)
    },
    (error) => {
      if (onError) onError(error)
    },
  )
}

/**
 * Update the verification status of a support record
 */
export async function updateSupporterStatus(supporterId, status) {
  if (!isFirebaseConfigured || !db) return { ok: false, error: 'Database offline' }
  try {
    const ref = doc(db, DEV_SUPPORTERS_COLLECTION, supporterId)
    await updateDoc(ref, {
      status,
      updatedAt: serverTimestamp(),
    })
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

/**
 * Delete a support record (Admin only)
 */
export async function deleteDevSupporter(supporterId) {
  if (!isFirebaseConfigured || !db) return { ok: false, error: 'Database offline' }
  try {
    const ref = doc(db, DEV_SUPPORTERS_COLLECTION, supporterId)
    await deleteDoc(ref)
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}
