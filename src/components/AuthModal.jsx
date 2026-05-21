import { useEffect, useState } from 'react'
import { useAuth } from '../context/auth-context.js'

export function AuthModal({ mode, onClose, onSwitchMode }) {
  const { signIn, signUp } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    state: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const switchMode = (next) => {
    setError('')
    onSwitchMode(next)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const action = mode === 'signup' ? await signUp(form) : await signIn(form)
    if (!action.ok) {
      setError(action.error)
      return
    }
    onClose()
  }

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="auth-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="badge">
          <span className="pulse" />
          {mode === 'signup' ? 'New Member' : 'Returning Member'}
        </p>
        <h2>
          {mode === 'signup' ? (
            <>
              Join the <em>swarm.</em>
            </>
          ) : (
            <>
              Welcome <em>back.</em>
            </>
          )}
        </h2>
        <p className="auth-sub">
          {mode === 'signup'
            ? 'Free, lifelong, revocable only by you. No fees. No selfies with the leader.'
            : 'Log in to participate in the forum, donate, and track your impact.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Full name
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              required
              minLength={4}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 4 characters"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </label>
          {mode === 'signup' && (
            <div className="auth-row">
              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Your city"
                />
              </label>
              <label>
                State
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Your state"
                />
              </label>
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-primary">
            {mode === 'signup' ? 'Create account' : 'Log in'} →
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'signup' ? 'Already a member?' : 'New here?'}{' '}
          <button
            type="button"
            className="link"
            onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')}
          >
            {mode === 'signup' ? 'Log in instead' : 'Create an account'}
          </button>
        </p>

        {mode === 'login' && (
          <p className="auth-hint">
            Admin access is granted to the email set in <code>VITE_ADMIN_EMAIL</code>.
          </p>
        )}
      </div>
    </div>
  )
}
