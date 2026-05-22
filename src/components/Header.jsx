import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from './Logo.jsx'
import { useAuth } from '../context/auth-context.js'
import { AuthModal } from './AuthModal.jsx'

export function Header() {
  const { isAuthenticated, isAdmin, user, signOut } = useAuth()
  const [authMode, setAuthMode] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  const openAuth = (mode) => setAuthMode(mode)
  const closeAuth = () => setAuthMode(null)

  const handleManifesto = (event) => {
    event.preventDefault()
    if (location.pathname !== '/') {
      navigate('/#manifesto')
      return
    }
    document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header className="site-header">
        <NavLink to="/" className="brand">
          <Logo />
          <div>
            <strong>COCKROACH JANTA PARTY</strong>
            <span>कॉकरोच जनता पार्टी · Est. 2026</span>
          </div>
        </NavLink>

        <nav className="site-nav" aria-label="Primary">
          <NavLink to="/" end>
            Home
          </NavLink>
          <a href="#manifesto" onClick={handleManifesto}>
            Manifesto
          </a>
          <NavLink to="/community">Community</NavLink>
          <NavLink to="/complaints">Complaints</NavLink>
          {/* <NavLink to="/donate">Donate</NavLink> */}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <span className="header-user" title={user.email}>
                {user.name?.split(' ')[0]}
                {isAdmin && <em className="role-tag">admin</em>}
              </span>
              <button type="button" className="btn btn-ghost" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-ghost" onClick={() => openAuth('login')}>
                Log in
              </button>
              <button type="button" className="btn btn-dark" onClick={() => openAuth('signup')}>
                Join the Party
              </button>
            </>
          )}
        </div>
      </header>

      {authMode && <AuthModal mode={authMode} onClose={closeAuth} onSwitchMode={openAuth} />}
    </>
  )
}
