import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Package, Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages.css';

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
              <a href="#" className="forgot-link">Forgot Password?</a>
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
    </div>
  );
};

export default LoginPage;
