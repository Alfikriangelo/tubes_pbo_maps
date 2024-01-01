// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthGuard from './authGuard';
import Login from './Pages/Login';
import Maps from './Pages/Maps';
import { AuthProvider } from './authContext'; // Import AuthProvider dari AuthContext.js

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/maps" element={<AuthGuard element={<Maps />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
