import { useNavigate } from 'react-router-dom';
import Home from './Home.jsx';
import { AuthModal } from '../components/AuthModal.jsx';

export function Join() {
  const navigate = useNavigate();
  return (
    <>
      <Home />
      <AuthModal 
        mode="signup" 
        onClose={() => navigate('/')} 
        onSwitchMode={(mode) => navigate('/' + mode === 'signup' ? 'join' : mode)} 
      />
    </>
  );
}
