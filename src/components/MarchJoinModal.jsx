import { useState } from 'react';
import { useAuth } from '../context/auth-context.js';
import { db } from '../lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './MarchJoinModal.css';

export function MarchJoinModal({ isOpen, onClose }) {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const hasExistingPhone = Boolean(user?.phone);
  const [phone, setPhone] = useState(user?.phone || '');
  const [joinMode, setJoinMode] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalPhone = hasExistingPhone ? user.phone : phone;
    
    if (!finalPhone || (typeof finalPhone === 'string' && !finalPhone.trim())) {
      setStatus({ type: 'error', message: 'Please enter a valid phone number.' });
      return;
    }
    
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    
    try {
      // First, update their profile with the phone number if needed
      await updateProfile(user.id, {
        phone: String(finalPhone).trim(),
      });

      // Next, add them to the separate collection
      await addDoc(collection(db, 'march_volunteers'), {
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: String(finalPhone).trim(),
        joinMode,
        joinedAt: serverTimestamp()
      });
      
      setStatus({ type: 'success', message: 'Thank you! We will connect with you shortly.' });
      if (!hasExistingPhone) setPhone('');
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to join. Please try again.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="march-modal-overlay" onClick={onClose}>
      <div className="march-modal-content bg-paper border-ink" onClick={(e) => e.stopPropagation()}>
        <button className="march-modal-close" onClick={onClose}>×</button>
        <h2 className="condensed">20 JULY PROTEST OR BEYOND</h2>
        
        {!isAuthenticated ? (
          <div className="march-modal-login-prompt">
            <p style={{ opacity: 0.8 }}>Please log in to join the movement.</p>
            <Link to="/login" className="btn-campaign condensed bg-ink text-paper" onClick={onClose}>LOG IN</Link>
          </div>
        ) : (
          <form className="march-modal-form" onSubmit={handleSubmit}>
            {hasExistingPhone ? (
              <p className="march-modal-sub">
                We have your phone number ({user.phone}) on file. Join us in Delhi if you can, or join virtually!
              </p>
            ) : (
              <>
                <p className="march-modal-sub">
                  Join us in Delhi if you can, or join virtually! We already have your name and email. Just provide your WhatsApp number so we can add you to the group.
                </p>
                <label>
                  WhatsApp Number
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Add phone number"
                    required
                  />
                </label>
              </>
            )}

            <label>
              How will you join?
              <select 
                value={joinMode} 
                onChange={(e) => setJoinMode(e.target.value)} 
                required
                style={{ padding: '0.75rem 1rem', border: '2px solid var(--ink)', borderRadius: '0.25rem', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--paper-soft)' }}
              >
                <option value="">Select an option</option>
                <option value="delhi">I can come to Delhi</option>
                <option value="virtually">I will join virtually</option>
              </select>
            </label>
            
            {status.message && (
              <p className={`march-modal-status ${status.type}`}>
                {status.message}
              </p>
            )}
            
            {!status.message || status.type === 'error' ? (
              <button type="submit" className="btn-campaign condensed bg-ink text-paper" disabled={isSubmitting}>
                {isSubmitting ? 'SUBMITTING...' : (hasExistingPhone ? "YES, I'M INTERESTED" : "JOIN THE MOVEMENT")}
              </button>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
