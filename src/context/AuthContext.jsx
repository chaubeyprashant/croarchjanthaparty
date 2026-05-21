import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { AuthContext } from './auth-context.js'
import {
  adminEmail,
  auth,
  db,
  firebaseConfigError,
  isFirebaseConfigured,
  normalizeDate,
} from '../lib/firebase.js'

function mapUserDoc(docSnap) {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    name: data.name || 'Member',
    email: data.email || '',
    city: data.city || '',
    state: data.state || '',
    role: data.role || 'member',
    joinedAt: normalizeDate(data.joinedAt) || new Date().toISOString(),
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([])
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(() => !isFirebaseConfigured)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) return undefined
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setSession(null)
        setUsers([])
        setAuthReady(true)
        return
      }

      const email = (firebaseUser.email || '').toLowerCase()
      const userRef = doc(db, 'users', firebaseUser.uid)
      const snapshot = await getDoc(userRef)

      if (!snapshot.exists()) {
        const role = adminEmail && email === adminEmail ? 'admin' : 'member'
        await setDoc(userRef, {
          name: firebaseUser.displayName || email.split('@')[0] || 'Member',
          email,
          city: '',
          state: '',
          role,
          joinedAt: serverTimestamp(),
        })
      }

      const hydrated = await getDoc(userRef)
      const data = hydrated.data() || {}
      setSession({
        id: firebaseUser.uid,
        email: email || data.email || '',
        name: data.name || firebaseUser.displayName || 'Member',
        role: data.role || 'member',
        city: data.city || '',
        state: data.state || '',
        joinedAt: normalizeDate(data.joinedAt) || new Date().toISOString(),
      })
      setAuthReady(true)
      setAuthError('')
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !session || session.role !== 'admin') return undefined
    const usersQuery = query(collection(db, 'users'), orderBy('joinedAt', 'desc'))
    return onSnapshot(usersQuery, (snapshot) => {
      setUsers(snapshot.docs.map(mapUserDoc))
    })
  }, [session])

  const signIn = useCallback(
    async ({ email, password }) => {
      if (!isFirebaseConfigured || !auth) {
        return { ok: false, error: firebaseConfigError() }
      }
      try {
        await signInWithEmailAndPassword(auth, (email || '').trim(), password || '')
        return { ok: true }
      } catch (error) {
        let message = 'Unable to sign in. Check your credentials.'
        if (error.code === 'auth/invalid-credential') message = 'Incorrect email or password.'
        if (error.code === 'auth/user-not-found') message = 'No account found for that email.'
        setAuthError(message)
        return { ok: false, error: message }
      }
    },
    [],
  )

  const signUp = useCallback(
    async ({ name, email, password, city, state }) => {
      if (!isFirebaseConfigured || !auth || !db) {
        return { ok: false, error: firebaseConfigError() }
      }
      const normalized = (email || '').trim().toLowerCase()
      if (!normalized || !password || !name) {
        return { ok: false, error: 'Name, email, and password are required.' }
      }
      try {
        const credential = await createUserWithEmailAndPassword(auth, normalized, password)
        const role = adminEmail && normalized === adminEmail ? 'admin' : 'member'
        await setDoc(doc(db, 'users', credential.user.uid), {
          name: name.trim(),
          email: normalized,
          city: (city || '').trim(),
          state: (state || '').trim(),
          role,
          joinedAt: serverTimestamp(),
        })
        setAuthError('')
        return { ok: true }
      } catch (error) {
        let message = 'Unable to create account.'
        if (error.code === 'auth/email-already-in-use') {
          message = 'An account already exists for that email.'
        } else if (error.code === 'auth/weak-password') {
          message = 'Password should be at least 6 characters.'
        }
        setAuthError(message)
        return { ok: false, error: message }
      }
    },
    [],
  )

  const signOut = useCallback(async () => {
    if (!auth) return
    await firebaseSignOut(auth)
    setSession(null)
    setUsers([])
  }, [])

  const promoteRole = useCallback(async (userId, role) => {
    if (!db) return
    await updateDoc(doc(db, 'users', userId), { role })
    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, role } : user)))
    setSession((current) => (current && current.id === userId ? { ...current, role } : current))
  }, [])

  const removeMember = useCallback(async (userId) => {
    if (!db) return
    await deleteDoc(doc(db, 'users', userId))
    setUsers((current) => current.filter((user) => user.id !== userId))
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session,
      users,
      authReady,
      authError,
      isAuthenticated: Boolean(session),
      isAdmin: session?.role === 'admin',
      signIn,
      signUp,
      signOut,
      promoteRole,
      removeMember,
    }),
    [
      session,
      users,
      authReady,
      authError,
      signIn,
      signUp,
      signOut,
      promoteRole,
      removeMember,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
