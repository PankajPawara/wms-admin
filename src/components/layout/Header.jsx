import React, { useState } from 'react';
import { Bell, Search, User, X, LogOut, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { updateUser } from '../../api/users.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Header = () => {
  const { user, setUser, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', mobile: user?.mobile || '', email: user?.email || '' });
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order #1029 generated', time: '5m ago' },
    { id: 2, text: 'Inventory synced successfully', time: '1h ago' }
  ]);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(user._id || user.id, data),
    onSuccess: (res) => {
      if (res.data?.user) setUser(res.data.user);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowProfile(false);
      alert('Profile updated successfully');
    },
    onError: (err) => {
      alert(`Error updating profile: ${err.message}`);
    }
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const clearNotifs = () => setNotifications([]);

  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search orders, inventory, employees..." />
      </div>

      <div className="header-actions">
        <button className="icon-btn" onClick={() => setShowNotif(true)} style={{ position: 'relative' }}>
          <Bell size={20} />
          {notifications.length > 0 && <span className="badge-dot"></span>}
        </button>
        
        <div className="user-profile" onClick={() => {
          setFormData({ name: user?.name || '', mobile: user?.mobile || '', email: user?.email || '' });
          setShowProfile(true);
        }} style={{ cursor: 'pointer' }}>
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">{user?.role || 'Administrator'}</span>
          </div>
        </div>
      </div>

      {showNotif && (
        <div style={{ position: 'absolute', top: '70px', right: '120px', width: '320px', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-md)', zIndex: 1000, padding: '1rem', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h3>
            <button className="icon-btn" onClick={() => setShowNotif(false)} style={{ padding: 0 }}><X size={16}/></button>
          </div>
          {notifications.length === 0 ? (
            <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '1rem 0' }}>No new notifications</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map(n => (
                <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-divider)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>{n.text}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{n.time}</span>
                </div>
              ))}
              <button className="btn" onClick={clearNotifs} style={{ marginTop: '0.5rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.875rem', padding: '0.5rem' }}>
                <Check size={14} style={{ marginRight: '0.25rem' }}/> Mark all as read
              </button>
            </div>
          )}
        </div>
      )}

      {showProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card page-enter" style={{ width: '400px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>My Profile</h2>
              <button className="icon-btn" onClick={() => setShowProfile(false)}><X size={20}/></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                // Update basic info
                await updateMutation.mutateAsync(formData);
                // Update password if provided
                if (formData.newPassword) {
                  const { default: api } = await import('../../api/axios');
                  await api.post('/auth/change-password', {
                    current_password: formData.currentPassword,
                    new_password: formData.newPassword,
                    confirm_password: formData.newPassword
                  });
                  alert('Password changed successfully');
                }
              } catch (err) {
                alert(`Error changing password: ${err.message || 'Unknown error'}`);
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Mobile / Contact</label>
                <input className="input-field" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }} />
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Change Password</h3>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Current Password</label>
                <input type="password" className="input-field" value={formData.currentPassword || ''} onChange={e => setFormData({...formData, currentPassword: e.target.value})} placeholder="Leave blank to keep current" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>New Password</label>
                <input type="password" className="input-field" value={formData.newPassword || ''} onChange={e => setFormData({...formData, newPassword: e.target.value})} placeholder="Leave blank to keep current" />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={logout} style={{ color: 'var(--color-danger)' }}>
                  <LogOut size={18} style={{ marginRight: '0.5rem' }}/> Logout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
