import { useNavigate } from 'react-router-dom';
import Home from './Home.jsx';
import { AuthModal } from '../components/AuthModal.jsx';

export function Reset() {
  const navigate = useNavigate();
  return (
    <>
      <Home />
      <AuthModal 
        mode="reset" 
        onClose={() => navigate('/')} 
        onSwitchMode={(mode) => navigate('/' + (mode === 'signup' ? 'join' : mode === 'reset' ? 'reset' : 'login'))} 
      />
    </>
  );
}
