import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Package, Lock, User, ShieldCheck, Play, RotateCcw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages.css';

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  // Animation states mapped to video stages:
  // stage 0: Walking + carrying box (0.00 - 0.02)
  // stage 1: Slip & lose balance (0.02 - 0.04)
  // stage 2: Fall down & drop box (0.04 - 0.07)
  // stage 3: Magical glow starts inside box (0.07 - 0.09)
  // stage 4: Login card emerges & pops up (0.09 - 0.13)
  // stage 5: Man gets up, smiles, and thumbs up (0.13 - end)
  const [animationStage, setAnimationStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      if (time < 2) {
        setAnimationStage(0);
      } else if (time >= 2 && time < 4) {
        setAnimationStage(1);
      } else if (time >= 4 && time < 7) {
        setAnimationStage(2);
      } else if (time >= 7 && time < 9) {
        setAnimationStage(3);
      } else if (time >= 9 && time < 13) {
        setAnimationStage(4);
      } else {
        setAnimationStage(5);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

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

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restartAnimation = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="login-container theme-enhanced-login">
      {/* Fullscreen Video Background */}
      <div className="login-visual-container">
        <video 
          ref={videoRef}
          className="login-animation-video"
          src="/login-intro.mp4"
          autoPlay
          muted
          playsInline
          loop
        />
        
        {/* Magic Particles / Sparkles overlay triggered during glowing stage */}
        {animationStage === 3 && (
          <div className="magic-glow-overlay">
            <div className="sparkle sp-1"></div>
            <div className="sparkle sp-2"></div>
            <div className="sparkle sp-3"></div>
          </div>
        )}

        {/* Video controls */}
        <div className="video-control-buttons">
          <button className="video-ctrl-btn" onClick={togglePlayback} title={isPlaying ? 'Pause Intro' : 'Play Intro'}>
            {isPlaying ? <Lock size={14} /> : <Play size={14} />}
          </button>
          <button className="video-ctrl-btn" onClick={restartAnimation} title="Restart Intro">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      
      {/* Login Card overlay containing the form, positioned in the center, appearing at stage 4 */}
      <div className={`login-card-overlay-wrapper anim-stage-${animationStage}`}>
        <div className="card login-card glass-3d-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div className="glass-icon-wrapper">
              <Package size={32} className="logo-icon" style={{ color: 'var(--color-primary)' }} />
            </div>
          </div>
          <h2>Login to your account</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Employee ID</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="input-field glass-input"
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
                  className="input-field glass-input"
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

            <button type="submit" className="btn btn-primary login-btn glass-btn" disabled={isLoading}>
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
