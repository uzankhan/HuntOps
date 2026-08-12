import React from 'react';
import { theme } from '../styles/theme';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'community', label: '🌍 Community' },
    { id: 'settings', label: '⚙️ Settings' }
  ];

  return (
    <div style={{
      width: '220px',
      background: theme.colors.dark,
      height: '100vh',
      padding: '20px 0',
      borderRight: `2px solid ${theme.colors.gold}`,
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <h2 style={{ color: theme.colors.gold, textAlign: 'center', paddingBottom: '20px', borderBottom: `1px solid ${theme.colors.gold}` }}>
        🎯 HUNTOPS
      </h2>
      <div style={{ marginTop: '30px' }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 25px',
              color: activeTab === tab.id ? theme.colors.gold : theme.colors.silver,
              background: activeTab === tab.id ? theme.colors.burgundy : 'transparent',
              borderLeft: activeTab === tab.id ? `4px solid ${theme.colors.gold}` : '4px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal'
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        textAlign: 'center',
        color: theme.colors.silver,
        fontSize: '11px',
        padding: '10px'
      }}>
        Made by Uzan Khan
      </div>
    </div>
  );
};