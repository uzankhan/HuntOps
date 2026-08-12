import React, { useState, useEffect } from 'react';
import { theme } from '../styles/theme';

interface StolenDevice {
  id: string;
  imei: string;
  device_name: string;
  last_location: string;
  reported_at: string;
  status: 'stolen' | 'recovered';
}

export const Community: React.FC = () => {
  const [stolenDevices, setStolenDevices] = useState<StolenDevice[]>([
    {
      id: '1',
      imei: '123456789012345',
      device_name: 'iPhone 15 Pro',
      last_location: 'Karachi, Pakistan',
      reported_at: '2026-08-11 14:30',
      status: 'stolen'
    },
    {
      id: '2',
      imei: '987654321098765',
      device_name: 'Samsung Galaxy S24',
      last_location: 'Lahore, Pakistan',
      reported_at: '2026-08-10 09:15',
      status: 'stolen'
    }
  ]);

  const [reportData, setReportData] = useState({
    imei: '',
    device_name: '',
    last_location: ''
  });

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportData.imei || !reportData.device_name) {
      alert('Please fill in all fields');
      return;
    }

    const newReport: StolenDevice = {
      id: Date.now().toString(),
      imei: reportData.imei,
      device_name: reportData.device_name,
      last_location: reportData.last_location || 'Unknown',
      reported_at: new Date().toLocaleString(),
      status: 'stolen'
    };

    setStolenDevices([newReport, ...stolenDevices]);
    setReportData({ imei: '', device_name: '', last_location: '' });
    alert('✅ Device reported as stolen! Community will be notified.');
  };

  return (
    <div style={{ padding: '20px', background: '#0a0a0a', minHeight: '100vh' }}>
      <h2 style={{ color: theme.colors.gold }}>🌍 Community Watch</h2>
      <p style={{ color: theme.colors.silver, marginBottom: '20px' }}>
        Report stolen devices and help others recover their phones.
      </p>

      {/* Report Form */}
      <div style={{
        background: theme.colors.dark,
        padding: '20px',
        borderRadius: '10px',
        border: `1px solid ${theme.colors.gold}`,
        marginBottom: '30px',
        maxWidth: '500px'
      }}>
        <h3 style={{ color: theme.colors.gold, marginBottom: '15px' }}>📢 Report Stolen Device</h3>
        <form onSubmit={handleReport}>
          <input
            type="text"
            placeholder="IMEI (15 digits)"
            value={reportData.imei}
            onChange={(e) => setReportData({ ...reportData, imei: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              background: '#222',
              color: 'white',
              border: `1px solid ${theme.colors.silver}`,
              borderRadius: '5px'
            }}
          />
          <input
            type="text"
            placeholder="Device Name"
            value={reportData.device_name}
            onChange={(e) => setReportData({ ...reportData, device_name: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              background: '#222',
              color: 'white',
              border: `1px solid ${theme.colors.silver}`,
              borderRadius: '5px'
            }}
          />
          <input
            type="text"
            placeholder="Last Known Location"
            value={reportData.last_location}
            onChange={(e) => setReportData({ ...reportData, last_location: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              background: '#222',
              color: 'white',
              border: `1px solid ${theme.colors.silver}`,
              borderRadius: '5px'
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: theme.colors.gold,
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Report Device
          </button>
        </form>
      </div>

      {/* Stolen Devices List */}
      <h3 style={{ color: theme.colors.gold, marginBottom: '15px' }}>
        📋 Reported Stolen Devices ({stolenDevices.length})
      </h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        {stolenDevices.map((device) => (
          <div
            key={device.id}
            style={{
              background: '#1a1a1a',
              padding: '15px',
              borderRadius: '8px',
              borderLeft: `4px solid ${device.status === 'stolen' ? '#dc3545' : '#28a745'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: 'white' }}>{device.device_name}</strong>
              <span style={{ color: device.status === 'stolen' ? '#dc3545' : '#28a745' }}>
                {device.status === 'stolen' ? '🔴 Stolen' : '✅ Recovered'}
              </span>
            </div>
            <small style={{ color: theme.colors.silver }}>IMEI: {device.imei}</small>
            <br />
            <small style={{ color: theme.colors.silver }}>
              📍 {device.last_location} | Reported: {device.reported_at}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};