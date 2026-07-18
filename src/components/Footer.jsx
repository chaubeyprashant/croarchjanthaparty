import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer bg-ink text-paper">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="condensed footer-title">THE COCKROACH JANTA PARTY</h2>
            <p className="footer-tagline text-paper/70">Main Bhi Cockroach.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h3 className="condensed">NAVIGATION</h3>
              <a href="/#vision">Vision</a>
              <a href="/#manifesto">Manifesto</a>
              <Link to="/articles">Articles</Link>
            </div>
            <div className="link-group">
              <h3 className="condensed">ACTIONS</h3>
              <Link to="/join">Join the Party</Link>
              <Link to="/complaints">Raise an Issue</Link>
              <Link to="/donate">Support the Dev</Link>
            </div>
            <div className="link-group">
              <h3 className="condensed">LEGAL</h3>
              <Link to="/disclaimer">Disclaimer</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <a href="mailto:contact@thecockroachjantaparty.org.in">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} The Cockroach Janta Party. This is a satirical political movement.</p>
          <div className="social-links">
            <a href="https://www.instagram.com/cockroachjantaparty/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://x.com/Cockroachisback" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
