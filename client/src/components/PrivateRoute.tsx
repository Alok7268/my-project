import { Navigate } from 'react-router-dom';
import { useAuthenticationStatus } from '@nhost/react';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthenticationStatus();

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
