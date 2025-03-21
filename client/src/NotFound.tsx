import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/signin'); // Auto-redirect to SignIn
  }, [navigate]);

  return null; // No UI needed since it's a direct redirect
};

export default NotFound;
