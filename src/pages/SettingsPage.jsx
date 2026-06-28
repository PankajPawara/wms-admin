import React from 'react';
import { Database, Shield, Server, Bell } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon-wrapper purple" style={{ width: '40px', height: '40px' }}>
              <Shield size={20} />
            </div>
            <h2 style={{ fontSize: '1.125rem', color: 'var(--color-text-primary)' }}>Security & Auth</h2>
          </div>
          
          <div className="input-group">
            <label className="input-label">Session Timeout (minutes)</label>
            <input type="number" className="input-field" defaultValue={30} />
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon-wrapper blue" style={{ width: '40px', height: '40px' }}>
              <Database size={20} />
            </div>
            <h2 style={{ fontSize: '1.125rem', color: 'var(--color-text-primary)' }}>System Status</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Database Connection</span>
              <span className="badge badge-success">Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>API Status</span>
              <span className="badge badge-success">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
