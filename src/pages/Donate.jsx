import { useState } from 'react';
import './Donate.css';

export default function Donate() {
  const [activeTab, setActiveTab] = useState('domestic');

  return (
    <div className="donate-page bg-paper text-ink">
      <div className="donate-container">
        <div className="donate-header">
          <h1 className="donate-title condensed text-gold">SUPPORT THE DEV</h1>
          <p className="donate-subtitle">
            Voluntary contributions to the independent website developer for hosting, maintenance, and ongoing website development. 
            Not affiliated with any political party, election campaign, trust, or NGO.
          </p>
        </div>

        <div className="donate-box">
          <div className="donate-tabs">
            <button 
              className={`donate-tab condensed ${activeTab === 'domestic' ? 'active' : ''}`}
              onClick={() => setActiveTab('domestic')}
            >
              Domestic · UPI / Card
            </button>
            <button 
              className={`donate-tab condensed ${activeTab === 'international' ? 'active' : ''}`}
              onClick={() => setActiveTab('international')}
            >
              International · Wise
            </button>
          </div>

          <div className="donate-content">
            {activeTab === 'domestic' ? (
              <div className="donate-domestic">
                <h3 className="condensed text-gold">PAY VIA UPI OR CARD</h3>
                <p>Scan the QR code below using any UPI app (PhonePe, Google Pay, Paytm, etc.) or pay via Razorpay.</p>
                <div className="qr-container">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3Dchaubeyprashant20%40ybl%26pn%3DPrashant%20Kumar%20Chaubey" 
                    alt="UPI QR Code - chaubeyprashant20@ybl" 
                    className="qr-image" 
                  />
                </div>
                <p style={{ margin: '0.5rem 0 1rem', fontSize: '1.1rem' }}>
                  <strong>UPI ID:</strong> chaubeyprashant20@ybl
                </p>
                <p><strong>Name:</strong> PRASHANT KUMAR CHAUBEY</p>
                <button className="btn-pay condensed">PAY NOW WITH RAZORPAY</button>
              </div>
            ) : (
              <div className="donate-international">
                <h3 className="condensed text-gold">PAY VIA WISE</h3>
                <p>Support us from anywhere in the world using Wise.</p>
                <div className="wise-info">
                  <p>Wise (formerly TransferWise) is highly recommended for international transfers as it offers real exchange rates and low fees.</p>
                </div>
                <button className="btn-pay condensed" onClick={() => window.open('https://wise.com', '_blank')}>PAY NOW WITH WISE</button>
              </div>
            )}
          </div>
          
          <div className="donate-disclaimer">
            <p><strong>Note:</strong> Payments are processed securely. Your details are never stored on our servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
