import React, { useState, useContext } from 'react';
import { Database, Shield, Server, Bell, User, Monitor, Sun, Moon, HelpCircle, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ThemeContext } from '../context/ThemeContext';
import { updateUser } from '../api/users.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const { theme, changeTheme } = useContext(ThemeContext);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    mobile: user?.mobile || '', 
    email: user?.email || '',
    currentPassword: '',
    newPassword: ''
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(user._id || user.id, data),
    onSuccess: (res) => {
      if (res.data?.user) setUser(res.data.user);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      alert('Profile updated successfully');
    },
    onError: (err) => {
      alert(`Error updating profile: ${err.message}`);
    }
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
      if (formData.newPassword) {
        const { default: api } = await import('../api/axios');
        await api.post('/auth/change-password', {
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
          confirm_password: formData.newPassword
        });
        alert('Password changed successfully');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      }
    } catch (err) {
      alert(`Error: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="page-container page-enter">
      <div className="dashboard-header">
        <h1>Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px' }}>
        
        {/* Admin Profile Section */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon-wrapper purple" style={{ width: '40px', height: '40px' }}>
              <User size={20} />
            </div>
            <h2 style={{ fontSize: '1.125rem', color: 'var(--color-text-primary)' }}>Admin Profile</h2>
          </div>
          
          <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Name</label>
              <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label">Mobile / Contact</label>
              <input className="input-field" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            
            <div style={{ gridColumn: '1 / -1', margin: '1rem 0 0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>Change Password</h3>
            </div>
            
            <div className="input-group">
              <label className="input-label">Current Password</label>
              <input type="password" className="input-field" value={formData.currentPassword} onChange={e => setFormData({...formData, currentPassword: e.target.value})} placeholder="Leave blank to keep current" />
            </div>
            <div className="input-group">
              <label className="input-label">New Password</label>
              <input type="password" className="input-field" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} placeholder="Leave blank to keep current" />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Profile Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* UI Theme Section */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon-wrapper orange" style={{ width: '40px', height: '40px' }}>
              <Sun size={20} />
            </div>
            <h2 style={{ fontSize: '1.125rem', color: 'var(--color-text-primary)' }}>UI Theme</h2>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className={`btn ${theme === 'system' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => changeTheme('system')}
              style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
            >
              <Monitor size={18} style={{ marginRight: '0.5rem' }} /> System Default
            </button>
            <button 
              className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => changeTheme('light')}
              style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
            >
              <Sun size={18} style={{ marginRight: '0.5rem' }} /> Light
            </button>
            <button 
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => changeTheme('dark')}
              style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
            >
              <Moon size={18} style={{ marginRight: '0.5rem' }} /> Dark
            </button>
          </div>
        </div>

        {/* System Settings & Auth (Grid) */}
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
            <button className="btn btn-secondary">Update Timeout</button>
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

        {/* Support & About (Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-icon-wrapper green" style={{ width: '40px', height: '40px' }}>
                <HelpCircle size={20} />
              </div>
              <h2 style={{ fontSize: '1.125rem', color: 'var(--color-text-primary)' }}>Help & Support</h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Need assistance? Contact our support team or check the documentation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="#" style={{ color: 'var(--color-primary)', fontSize: '0.875rem' }}>Read Documentation &rarr;</a>
              <a href="#" style={{ color: 'var(--color-primary)', fontSize: '0.875rem' }}>Contact IT Support &rarr;</a>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-icon-wrapper blue" style={{ width: '40px', height: '40px' }}>
                <Info size={20} />
              </div>
              <h2 style={{ fontSize: '1.125rem', color: 'var(--color-text-primary)' }}>About</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>App Version</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>v1.0.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Environment</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Production</span>
              </div>
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                &copy; {new Date().getFullYear()} WMS Admin. All rights reserved.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
