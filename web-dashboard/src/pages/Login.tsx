import React, { useState } from 'react';
import axios from 'axios';
import { theme } from '../styles/theme';

interface LoginProps {
  setToken: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [email, setEmail] = useState('uzankhan17@gmail.com');
  const [password, setPassword] = useState('Cristiano_7');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      }
    } catch (err: any) {
      setMsg('❌ ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: `linear-gradient(135deg, ${theme.colors.dark}, ${theme.colors.burgundy})`, padding: 20 }}>
      <div style={{ background: theme.colors.dark, padding: '40px', borderRadius: '20px', border: `2px solid ${theme.colors.gold}`, width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: theme.colors.gold, textAlign: 'center' }}>🎯 HUNTOPS</h1>
        <p style={{ color: theme.colors.silver, textAlign: 'center', marginBottom: 30 }}>Developed by Uzan Khan</p>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: 15, background: '#222', color: 'white', border: `1px solid ${theme.colors.gold}`, borderRadius: 8 }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: 20, background: '#222', color: 'white', border: `1px solid ${theme.colors.gold}`, borderRadius: 8 }} />
          <button type="submit" style={{ width: '100%', padding: '12px', background: theme.colors.gold, color: '#000', fontWeight: 'bold', border: 'none', borderRadius: 8, fontSize: '16px' }}>Login</button>
        </form>
        <p style={{ color: '#aaa', textAlign: 'center', marginTop: 15 }}>{msg}</p>
      </div>
    </div>
  );
};