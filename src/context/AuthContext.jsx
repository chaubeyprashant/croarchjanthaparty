import { useCallback, useEffect, useMemo, useState } from 'react'
import { load, save } from '../lib/storage.js'
import { AuthContext } from './auth-context.js'

const SESSION_KEY = 'session'
const USERS_KEY = 'users'

const SEED_USERS = [
  {
    id: 'admin-1',
    name: 'Convenor',
    email: 'admin@cockroachjantaparty.org',
    password: 'admin',
    city: 'New Delhi',
    state: 'DL',
    role: 'admin',
    joinedAt: '2026-05-16T10:00:00.000Z',
  },
]

function hashPassword(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return `h${hash}`
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const stored = load(USERS_KEY, null)
    if (stored && stored.length) return stored
    const seeded = SEED_USERS.map((user) => ({
      ...user,
      password: hashPassword(user.password),
    }))
    save(USERS_KEY, seeded)
    return seeded
  })

  const [session, setSession] = useState(() => load(SESSION_KEY, null))

  useEffect(() => {
    save(USERS_KEY, users)
  }, [users])

  useEffect(() => {
    if (session) save(SESSION_KEY, session)
    else save(SESSION_KEY, null)
  }, [session])

  const signIn = useCallback(
    ({ email, password }) => {
      const normalized = (email || '').trim().toLowerCase()
      const match = users.find((user) => user.email.toLowerCase() === normalized)
      if (!match) return { ok: false, error: 'No account found for that email.' }
      if (match.password !== hashPassword(password || '')) {
        return { ok: false, error: 'Incorrect password.' }
      }
      const next = { id: match.id, email: match.email, name: match.name, role: match.role }
      setSession(next)
      return { ok: true, user: next }
    },
    [users],
  )

  const signUp = useCallback(
    ({ name, email, password, city, state }) => {
      const normalized = (email || '').trim().toLowerCase()
      if (!normalized || !password || !name) {
        return { ok: false, error: 'Name, email, and password are required.' }
      }
      if (users.some((user) => user.email.toLowerCase() === normalized)) {
        return { ok: false, error: 'An account already exists for that email.' }
      }
      const member = {
        id: `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        name: name.trim(),
        email: normalized,
        password: hashPassword(password),
        city: (city || '').trim(),
        state: (state || '').trim(),
        role: 'member',
        joinedAt: new Date().toISOString(),
      }
      setUsers((current) => [...current, member])
      const next = { id: member.id, email: member.email, name: member.name, role: member.role }
      setSession(next)
      return { ok: true, user: next }
    },
    [users],
  )

  const signOut = useCallback(() => {
    setSession(null)
  }, [])

  const promoteRole = useCallback((userId, role) => {
    setUsers((current) =>
      current.map((user) => (user.id === userId ? { ...user, role } : user)),
    )
  }, [])

  const removeMember = useCallback((userId) => {
    setUsers((current) => current.filter((user) => user.id !== userId))
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session,
      users,
      isAuthenticated: Boolean(session),
      isAdmin: session?.role === 'admin',
      signIn,
      signUp,
      signOut,
      promoteRole,
      removeMember,
    }),
    [session, users, signIn, signUp, signOut, promoteRole, removeMember],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
