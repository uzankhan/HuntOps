import React, { useState } from 'react';
import axios from 'axios';
import { theme } from '../styles/theme';

interface CommandCenterProps {
  token: string;
  devices: any[];
  onDeviceAdded: () => void;
  onLocationUpdated: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ token, devices, onDeviceAdded, onLocationUpdated }) => {
  const [imei, setImei] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [locImei, setLocImei] = useState('');
  const [latitude, setLatitude] = useState('24.8607');
  const [longitude, setLongitude] = useState('67.0011');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const API = 'http://localhost:5000/api';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imei || !deviceName) { setMessage('❌ IMEI and Name required'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/devices/register`, { imei, device_name: deviceName, model: 'Web UI', manufacturer: 'HuntOps' }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('✅ Device Registered!');
      setImei(''); setDeviceName('');
      onDeviceAdded();
    } catch (err: any) { setMessage('❌ ' + (err.response?.data?.message || err.message)); }
    setLoading(false);
  };

  const handleLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locImei) { setMessage('❌ IMEI required'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/tracking/location`, { imei: locImei, latitude: parseFloat(latitude), longitude: parseFloat(longitude) }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage(`✅ Location updated for ${locImei}`);
      onLocationUpdated();
    } catch (err: any) { setMessage('❌ ' + (err.response?.data?.message || err.message)); }
    setLoading(false);
  };

  const handleLock = async (imeiToLock: string) => {
    setLoading(true);
    try {
      await axios.post(`${API}/commands/send`, { imei: imeiToLock, command_type: 'lock', payload: { message: 'Locked by HuntOps' } }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage(`🔒 Lock sent to ${imeiToLock}`);
      onLocationUpdated();
    } catch (err: any) { setMessage('❌ Lock failed'); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '15px' }}>
      <h3 style={{ color: theme.colors.gold, borderBottom: `1px solid ${theme.colors.gold}`, paddingBottom: 10 }}>⚙️ Command Center</h3>
      
      <div style={{ background: theme.colors.darkLight, padding: '15px', borderRadius: 10, marginBottom: 15 }}>
        <h4 style={{ color: theme.colors.silver, marginTop: 0 }}>📱 Register Device</h4>
        <form onSubmit={handleRegister}>
          <input placeholder="IMEI (15 digits)" value={imei} onChange={(e) => setImei(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, background: '#111', color: 'white', border: `1px solid ${theme.colors.silver}`, borderRadius: 5 }} />
          <input placeholder="Device Name" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, background: '#111', color: 'white', border: `1px solid ${theme.colors.silver}`, borderRadius: 5 }} />
          <button type="submit" disabled={loading} style={{ background: theme.colors.gold, color: '#000', border: 'none', padding: '8px', width: '100%', borderRadius: 5, fontWeight: 'bold' }}>{loading ? '...' : 'Add Device'}</button>
        </form>
      </div>

      <div style={{ background: theme.colors.darkLight, padding: '15px', borderRadius: 10, marginBottom: 15 }}>
        <h4 style={{ color: theme.colors.silver, marginTop: 0 }}>📍 Update Location</h4>
        <form onSubmit={handleLocation}>
          <input placeholder="IMEI" value={locImei} onChange={(e) => setLocImei(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, background: '#111', color: 'white', border: `1px solid ${theme.colors.silver}`, borderRadius: 5 }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="Lat" value={latitude} onChange={(e) => setLatitude(e.target.value)} style={{ width: '50%', padding: '8px', background: '#111', color: 'white', border: `1px solid ${theme.colors.silver}`, borderRadius: 5 }} />
            <input placeholder="Lng" value={longitude} onChange={(e) => setLongitude(e.target.value)} style={{ width: '50%', padding: '8px', background: '#111', color: 'white', border: `1px solid ${theme.colors.silver}`, borderRadius: 5 }} />
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: 8, background: theme.colors.success, color: 'white', border: 'none', padding: '8px', width: '100%', borderRadius: 5, fontWeight: 'bold' }}>{loading ? '...' : 'Send Location'}</button>
        </form>
      </div>

      <h4 style={{ color: theme.colors.gold }}>📋 Devices</h4>
      {devices.map((d) => (
        <div key={d.id} style={{ background: '#1a1a1a', padding: '10px', marginBottom: 10, borderRadius: 8, borderLeft: `4px solid ${d.is_locked ? theme.colors.danger : theme.colors.gold}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong style={{ color: 'white' }}>{d.device_name}</strong>
            <span style={{ color: d.is_locked ? '#ff6b6b' : '#6bff6b' }}>{d.is_locked ? '🔒 Locked' : '🟢 Active'}</span>
          </div>
          <small style={{ color: theme.colors.silver }}>IMEI: {d.imei}</small><br />
          <small style={{ color: theme.colors.silver }}>Loc: {d.last_latitude || 'N/A'}, {d.last_longitude || 'N/A'}</small><br />
          {!d.is_locked && <button onClick={() => handleLock(d.imei)} disabled={loading} style={{ marginTop: 5, background: theme.colors.danger, color: 'white', border: 'none', padding: '4px 15px', borderRadius: 5 }}>Lock</button>}
        </div>
      ))}
      <p style={{ color: theme.colors.warning }}>{message}</p>
    </div>
  );
};