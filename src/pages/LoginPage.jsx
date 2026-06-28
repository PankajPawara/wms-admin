import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Navigate } from 'react-router-dom';
import { Package, Lock, User, ShieldCheck, X, KeyRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages.css';

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(employeeId, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <Package size={48} className="logo-icon" />
          </div>
          <h1>WMS Admin</h1>
          <p>Warehouse Management Dashboard</p>
        </div>
      </div>
      
      <div className="login-card-wrapper">
        <div className="card login-card">
          <h2>Login to your account</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Employee ID</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember Me
              </label>
              <button 
                type="button" 
                className="forgot-link" 
                onClick={() => setShowForgotModal(true)}
                style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary)', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'LOGIN'}
            </button>
          </form>

          <div className="secure-badge">
            <ShieldCheck size={16} />
            <span>Secure & Trusted Access</span>
          </div>
        </div>
      </div>

      {showForgotModal && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowForgotModal(false); }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001
          }}
        >
          <div className="card page-enter" style={{ width: '400px', padding: '2.5rem', textAlign: 'center', position: 'relative' }}>
            <button className="icon-btn" onClick={() => setShowForgotModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem' }}><X size={20}/></button>
            <div style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              <KeyRound size={48} style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>Forgot Password?</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              For security reasons, database password resets are managed directly by WMS IT Support. Please contact your system administrator or the IT Help Desk to recover your account:
            </p>
            <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>
              support@wms.com
            </div>
            <button className="btn btn-primary" onClick={() => setShowForgotModal(false)} style={{ width: '100%' }}>
              Okay, I understand
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default LoginPage;
