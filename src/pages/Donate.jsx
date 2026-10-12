import { useEffect, useState } from 'react';
import { Seo } from '../components/Seo.jsx';
import { useAuth } from '../context/auth-context.js';
import { recordDonatePageVisit } from '../lib/supporters.js';
import './Donate.css';

export default function Donate() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('domestic');

  // Automatically record page visit to Firebase donate_page_visits collection
  useEffect(() => {
    recordDonatePageVisit(user);
  }, [user]);

  return (
    <>
      <Seo
        title="Support the Developer"
        description="Every contribution directly supports the ongoing development and maintenance of this website, as well as the upcoming mobile app for the Cockroach community."
        canonicalPath="/donate"
      />
      <div className="donate-page bg-paper text-ink">
        <div className="donate-container">
          <div className="donate-header">
            <h1 className="donate-title condensed text-gold">SUPPORT THE DEV</h1>
            <p className="donate-subtitle">
              Voluntary contributions to support the independent developer. <strong>Every amount contributed goes directly towards the ongoing development, server hosting, and maintenance of this website.</strong>
            </p>

            <div className="donate-mobile-app-banner">
              <span className="app-badge condensed">COMING SOON</span>
              <div className="app-banner-content">
                <strong>📱 Mobile App Coming Soon for the Cockroach Community</strong>
                <p>
                  We are actively developing a dedicated mobile app for the Cockroach community to deliver real-time updates, community action tools, and alerts directly to your phone!
                </p>
              </div>
            </div>

            <p className="donate-legal-note">
              Not affiliated with any political party, election campaign, trust, or NGO.
            </p>
          </div>

          <div className="donate-box">
            <div className="donate-tabs">
              <button 
                className={`donate-tab condensed ${activeTab === 'domestic' ? 'active' : ''}`}
                onClick={() => setActiveTab('domestic')}
                type="button"
              >
                Domestic · UPI
              </button>
              <button 
                className={`donate-tab condensed ${activeTab === 'international' ? 'active' : ''}`}
                onClick={() => setActiveTab('international')}
                type="button"
              >
                International · Wise
              </button>
            </div>

            <div className="donate-content">
              {activeTab === 'domestic' ? (
                <div className="donate-domestic">
                  <h3 className="condensed text-gold">PAY VIA UPI</h3>
                  <p>Scan the QR code below using any UPI app (PhonePe, Google Pay, Paytm, etc.).</p>
                  <div className="qr-container">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3Dchaubeyprashant20%40ybl%26pn%3DPrashant%20Kumar%20Chaubey" 
                      alt="UPI QR Code - chaubeyprashant20@ybl" 
                      className="qr-image" 
                      width="250"
                      height="250"
                    />
                  </div>
                  <p style={{ margin: '0.5rem 0 1rem', fontSize: '1.1rem' }}>
                    <strong>UPI ID:</strong> chaubeyprashant20@ybl
                  </p>
                  <p><strong>Name:</strong> PRASHANT KUMAR CHAUBEY</p>
                </div>
              ) : (
                <div className="donate-international">
                  <h3 className="condensed text-gold">PAY VIA WISE</h3>
                  <p>Support us from anywhere in the world using Wise.</p>
                  <div className="wise-info">
                    <p>Wise (formerly TransferWise) is highly recommended for international transfers as it offers real exchange rates and low fees.</p>
                  </div>
                  <button 
                    className="btn-pay condensed" 
                    type="button" 
                    onClick={() => window.open('https://wise.com/pay/business/prashantchaubey?utm_source=open_link', '_blank')}
                  >
                    PAY NOW WITH WISE
                  </button>
                </div>
              )}
            </div>
            
            <div className="donate-disclaimer">
              <p><strong>Note:</strong> Every contribution directly funds website development, maintenance, and the upcoming mobile app. Payments are processed securely and details are never stored on our servers.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
