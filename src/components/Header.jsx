import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { useAuth } from '../context/auth-context.js';
import './Header.css';

export default function Header() {
  const { isAuthenticated, user, signOut, authReady } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="header bg-paper border-ink">
      <div className="header-container">
        <Link to="/" className="logo-group">
          <svg width="48" height="48" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Cockroach Janta Party emblem" className="logo-svg">
            <circle cx="100" cy="100" r="96" fill="#F4EBD7"></circle>
            <circle cx="100" cy="100" r="96" fill="none" stroke="#1A1108" strokeWidth="6"></circle>
            <circle cx="100" cy="100" r="85" fill="none" stroke="#C9A227" strokeWidth="1.6" strokeDasharray="3 4"></circle>
            <circle cx="100" cy="100" r="76" fill="none" stroke="#1A1108" strokeWidth="1.8"></circle>
            <g fill="#C9A227">
              <polygon points="100,18 101.8,22.6 106.8,22.6 102.7,25.4 104.4,30 100,27.2 95.6,30 97.3,25.4 93.2,22.6 98.2,22.6"></polygon>
              <polygon points="100,182 101.8,177.4 106.8,177.4 102.7,174.6 104.4,170 100,172.8 95.6,170 97.3,174.6 93.2,177.4 98.2,177.4"></polygon>
              <circle cx="18" cy="100" r="2.4"></circle>
              <circle cx="182" cy="100" r="2.4"></circle>
            </g>
            <g transform="translate(100 107)" fill="#1A1108" stroke="#1A1108" strokeLinecap="round" strokeLinejoin="round">
              <path d="M -3 -34 Q -15 -50 -30 -56" fill="none" strokeWidth="3"></path>
              <path d="M 3 -34 Q 15 -50 30 -56" fill="none" strokeWidth="3"></path>
              <path d="M -12 -10 Q -28 -16 -42 -22" fill="none" strokeWidth="3.6"></path>
              <path d="M -16 2 Q -34 4 -48 2" fill="none" strokeWidth="3.6"></path>
              <path d="M -12 20 Q -28 30 -40 38" fill="none" strokeWidth="3.6"></path>
              <path d="M 12 -10 Q 28 -16 42 -22" fill="none" strokeWidth="3.6"></path>
              <path d="M 16 2 Q 34 4 48 2" fill="none" strokeWidth="3.6"></path>
              <path d="M 12 20 Q 28 30 40 38" fill="none" strokeWidth="3.6"></path>
              <ellipse cx="0" cy="-28" rx="8" ry="6"></ellipse>
              <path d="M -14 -22 Q -14 -8 -10 -4 L 10 -4 Q 14 -8 14 -22 Q 0 -27 -14 -22 Z"></path>
              <path d="M -16 -5 Q -22 4 -18 18 Q -12 32 0 34 Q 12 32 18 18 Q 22 4 16 -5 Z"></path>
              <line x1="0" y1="-3" x2="0" y2="32" stroke="#F4EBD7" strokeWidth="1.4" opacity="0.55"></line>
            </g>
          </svg>
          <div className="logo-text">
            <div className="logo-title condensed text-ink">
              <div>THE COCKROACH</div>
              <div>JANTA PARTY</div>
            </div>
            <div className="logo-subtitle text-ink-muted">कॉकरोच जनता पार्टी · Est. 2026</div>
          </div>
        </Link>
        <nav className="desktop-nav">
          <Link to="/articles" className="nav-link condensed">Articles</Link>
          <Link to="/gallery" className="nav-link condensed">Gallery</Link>
          <Link to="/members" className="nav-link condensed">Members</Link>
          <Link to="/chat" className="nav-link condensed" style={{ color: 'var(--red)' }}>Live Chat</Link>
          <Link to="/complaints" className="nav-link condensed">Issues</Link>
          <Link to="/cockroach-tracker" className="nav-link condensed">Tracker</Link>
          <Link to="/protests" className="nav-link condensed">Protests</Link>
        </nav>
        <div className="header-actions">
          <div className="lang-selector">
            <button type="button" className="lang-btn condensed text-ink">
              <Globe size={14} />
              <span className="lang-text">English</span>
              <span className="lang-text-mobile">EN</span>
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
              </svg>
            </button>
          </div>
          {!authReady ? (
            <div className="btn-join condensed bg-ink text-paper" style={{ opacity: 0.7, padding: '0.5rem 1rem' }}>LOADING...</div>
          ) : isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-link condensed" style={{ padding: '0.5rem 1rem' }}>PROFILE</Link>
              <button onClick={signOut} className="btn-join condensed bg-ink text-paper" style={{ border: 'none', cursor: 'pointer' }}>
                LOG OUT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link condensed" style={{ padding: '0.5rem 1rem' }}>LOG IN</Link>
              <Link to="/join" className="btn-join condensed bg-ink text-paper">JOIN THE PARTY →</Link>
            </>
          )}
          <Link to="/complaints/new" className="btn-raise condensed text-ink border-ink">FILE COMPLAINT →</Link>
          <Link to="/donate" className="btn-raise condensed text-ink border-ink" style={{ marginLeft: '0.5rem', backgroundColor: 'var(--gold)' }}>SUPPORT DEV ☕</Link>
          <button 
            className="mobile-menu-btn text-ink" 
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu bg-paper border-ink">
          <nav className="mobile-nav">
            <Link to="/articles" className="mobile-nav-link condensed" onClick={() => setIsMobileMenuOpen(false)}>Articles</Link>
            <Link to="/gallery" className="mobile-nav-link condensed" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
            <Link to="/members" className="mobile-nav-link condensed" onClick={() => setIsMobileMenuOpen(false)}>Members</Link>
            <Link to="/chat" className="mobile-nav-link condensed" style={{ color: 'var(--red)' }} onClick={() => setIsMobileMenuOpen(false)}>Live Chat</Link>
            <Link to="/complaints" className="mobile-nav-link condensed" onClick={() => setIsMobileMenuOpen(false)}>Issues</Link>
            <Link to="/cockroach-tracker" className="mobile-nav-link condensed" onClick={() => setIsMobileMenuOpen(false)}>Tracker</Link>
            <Link to="/protests" className="mobile-nav-link condensed" onClick={() => setIsMobileMenuOpen(false)}>Protests</Link>
            
            <div className="mobile-menu-actions">
              {!authReady ? (
                <div className="btn-join condensed bg-ink text-paper" style={{ display: 'inline-flex', opacity: 0.7, padding: '0.75rem 1rem' }}>LOADING...</div>
              ) : isAuthenticated ? (
                <>
                  <Link to="/profile" className="mobile-nav-link condensed" onClick={() => setIsMobileMenuOpen(false)}>PROFILE</Link>
                  <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="btn-join condensed bg-ink text-paper" style={{ display: 'inline-flex', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
                    LOG OUT
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mobile-nav-link condensed" onClick={() => setIsMobileMenuOpen(false)}>LOG IN</Link>
                  <Link to="/join" className="btn-join condensed bg-ink text-paper" style={{ display: 'inline-flex' }} onClick={() => setIsMobileMenuOpen(false)}>JOIN THE PARTY →</Link>
                </>
              )}
              <Link to="/donate" className="btn-raise condensed text-ink border-ink" style={{ display: 'inline-flex', marginTop: '0.5rem', justifyContent: 'center', backgroundColor: 'var(--gold)' }} onClick={() => setIsMobileMenuOpen(false)}>SUPPORT DEV ☕</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
