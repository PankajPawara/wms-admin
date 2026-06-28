import React, { useState } from 'react';
import { Bell, Search, User, X, LogOut, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order #1029 generated', time: '5m ago' },
    { id: 2, text: 'Inventory synced successfully', time: '1h ago' }
  ]);

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
        
        <div className="user-profile" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
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
    </header>
  );
};

export default Header;
