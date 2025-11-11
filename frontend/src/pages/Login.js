import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Invalid username or password');
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Login</h1>
            <p>PIWC Grand Rapids - Content Management</p>
          </div>

          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-login"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>Need access? Contact the church administrator.</p>
          </div>
        </div>

        <div className="login-info">
          <h2>Admin Portal</h2>
          <p>
            This area is restricted to authorized church staff and administrators only.
          </p>
          <ul>
            <li>📸 Upload and manage photo gallery</li>
            <li>📝 Edit website content (homepage, services, contact)</li>
            <li>💬 View contact messages and prayer requests</li>
            <li>🎯 Update events and announcements</li>
          </ul>
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
            <strong>Default Login:</strong><br />
            Username: <code>admin</code><br />
            Password: <code>admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

