import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { theme } from '../styles/theme';
import { Sidebar } from '../components/Sidebar';
import { MapView } from '../components/MapView';
import { CommandCenter } from '../components/CommandCenter';

interface DashboardProps {
  token: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [devices, setDevices] = useState<any[]>([]);

  const fetchDevices = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/devices', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setDevices(res.data.devices);
    } catch (e) { console.error(e); }
  }, [token]);

  useEffect(() => { fetchDevices(); }, [fetchDevices]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a', color: 'white' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#111', padding: '15px 30px', borderBottom: `1px solid ${theme.colors.gold}` }}>
          <h3 style={{ color: theme.colors.gold, margin: 0 }}>📍 Dashboard</h3>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ width: '380px', overflowY: 'auto', background: theme.colors.dark, borderRight: `1px solid ${theme.colors.silver}33` }}>
            <CommandCenter token={token} devices={devices} onDeviceAdded={fetchDevices} onLocationUpdated={fetchDevices} />
          </div>
          <div style={{ flex: 1 }}><MapView devices={devices} /></div>
        </div>
      </div>
    </div>
  );
};