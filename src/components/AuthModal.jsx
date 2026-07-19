import { useEffect, useState } from 'react'
import { useAuth } from '../context/auth-context.js'

export function AuthModal({ mode, onClose, onSwitchMode }) {
  const { signIn, signUp, resetPassword } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    state: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const switchMode = (next) => {
    setError('')
    setSuccess('')
    onSwitchMode(next)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    
    if (mode === 'reset') {
      const action = await resetPassword(form.email)
      if (!action.ok) {
        setError(action.error)
      } else {
        setSuccess('Password reset email sent. Check your inbox.')
      }
      return
    }

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
          {mode === 'signup' ? 'New Member' : mode === 'reset' ? 'Reset Password' : 'Returning Member'}
        </p>
        <h2>
          {mode === 'signup' ? (
            <>Join the <em>swarm.</em></>
          ) : mode === 'reset' ? (
            <>Forgot <em>Password?</em></>
          ) : (
            <>Welcome <em>back.</em></>
          )}
        </h2>
        <p className="auth-sub">
          {mode === 'signup'
            ? 'Free, lifelong, revocable only by you. No fees. No selfies with the leader.'
            : mode === 'reset'
            ? 'Enter your email below to receive a password reset link.'
            : 'Log in to participate in the forum, file complaints, and track your impact.'}
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
          {mode === 'signup' && (
            <label>
              Phone Number
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Add phone number"
                autoComplete="tel"
              />
            </label>
          )}
          {mode !== 'reset' && (
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
              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    className="link"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => switchMode('reset')}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </label>
          )}
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
          {success && <p className="auth-success" style={{ color: 'var(--green)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{success}</p>}

          <button type="submit" className="btn btn-primary">
            {mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Log in'} →
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'signup' ? 'Already a member?' : mode === 'reset' ? 'Remembered your password?' : 'New here?'}{' '}
          <button
            type="button"
            className="link"
            onClick={() => switchMode(mode === 'signup' ? 'login' : mode === 'reset' ? 'login' : 'signup')}
          >
            {mode === 'signup' ? 'Log in instead' : mode === 'reset' ? 'Back to login' : 'Create an account'}
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
