import { NhostClient } from '@nhost/react';
import { NhostProvider } from '@nhost/react';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import MainContent from './MainContent';

const App = () => (
  <NhostProvider nhost={nhost}>
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/main" element={<MainContent />} />
      </Routes>
    </Router>
  </NhostProvider>
);

export const nhost = new NhostClient({
  subdomain: 'zwaexdysjggdivpgunmg',   // Found in your Nhost project settings
  region: 'ap-south-1'          // Found in your Nhost project settings
});

export default App;
