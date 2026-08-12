import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login.tsx';
import { Dashboard } from './pages/Dashboard.tsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  if (!token) return <Login setToken={setToken} />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard token={token} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;