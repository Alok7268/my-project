import { NhostClient, NhostProvider } from '@nhost/react';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import MainContent from './MainContent';
import NotFound from './NotFound';

const TokenHandler = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;

  useEffect(() => {
    const token = nhost.auth.getAccessToken();
    const excludedRoutes = ['/signin', '/signup'];

    if (!token && !excludedRoutes.includes(location)) {
      navigate('/signin'); // Redirect to SignIn only if not on excluded routes
    }
  }, [navigate, location]);

  return null;
};


const App = () => (
  <NhostProvider nhost={nhost}>
    <Router>
      <TokenHandler />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/main" element={<MainContent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </NhostProvider>
);

export const nhost = new NhostClient({
  subdomain: 'zwaexdysjggdivpgunmg',   // Found in your Nhost project settings
  region: 'ap-south-1'          // Found in your Nhost project settings
});

export default App;