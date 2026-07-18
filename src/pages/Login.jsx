import { useNavigate } from 'react-router-dom';
import Home from './Home.jsx';
import { AuthModal } from '../components/AuthModal.jsx';

export function Login() {
  const navigate = useNavigate();
  return (
    <>
      <Home />
      <AuthModal 
        mode="login" 
        onClose={() => navigate('/')} 
        onSwitchMode={(mode) => navigate('/' + (mode === 'signup' ? 'join' : mode))} 
      />
    </>
  );
}
