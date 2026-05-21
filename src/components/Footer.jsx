import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div>
          <p className="footer-brand">Cockroach Janta Party</p>
          <p>
            A political party for the lazy, the unemployed, and the chronically correct.
            Headquartered wherever the wifi works.
          </p>
        </div>

        <div>
          <h4>The Party</h4>
          <ul>
            <li>
              <Link to="/#vision">Vision</Link>
            </li>
            <li>
              <Link to="/#manifesto">Manifesto</Link>
            </li>
            <li>
              <Link to="/#contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Get involved</h4>
          <ul>
            <li>
              <Link to="/community">Community</Link>
            </li>
            <li>
              <Link to="/donate">Donate</Link>
            </li>
            <li>
              <Link to="/#eligibility">Eligibility</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Follow</h4>
          <ul>
            <li>
              <a href="https://x.com" target="_blank" rel="noreferrer">
                Twitter / X
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://youtube.com" target="_blank" rel="noreferrer">
                YouTube
              </a>
            </li>
            <li>
              <a href="https://telegram.org" target="_blank" rel="noreferrer">
                Telegram
              </a>
            </li>
          </ul>
        </div>
      </footer>

      <div className="footer-meta">
        <a href="#privacy">Privacy</a>
        <a href="#press">Press</a>
        <Link to="/#contact">Contact</Link>
        <span>© {new Date().getFullYear()} Cockroach Janta Party</span>
      </div>
    </>
  )
}
