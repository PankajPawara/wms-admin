import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search orders, inventory, employees..." />
      </div>

      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge-dot"></span>
        </button>
        
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">{user?.role || 'Administrator'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
