import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context.js';
import './Profile.css';

export function Profile() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: '',
    city: '',
    state: '',
    phone: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setForm({
        name: user.name || '',
        city: user.city || '',
        state: user.state || '',
        phone: user.phone || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus({ type: '', message: '' });
    
    const action = await updateProfile(user.id, form);
    
    if (action.ok) {
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
    } else {
      setStatus({ type: 'error', message: action.error });
    }
    setIsSaving(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="profile-page">
      <div className="profile-container bg-paper border-ink">
        <h1 className="condensed">EDIT PROFILE</h1>
        <p className="profile-email">Account: {user?.email}</p>
        
        <form className="profile-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </label>
          
          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Add phone number"
            />
          </label>
          
          <div className="profile-row">
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
          
          {status.message && (
            <p className={`profile-status ${status.type}`}>
              {status.message}
            </p>
          )}
          
          <button 
            type="submit" 
            className="btn-profile-save condensed bg-ink text-paper"
            disabled={isSaving}
          >
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </form>
      </div>
    </div>
  );
}
