import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminSettings.css';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    // Clear message when user starts typing
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        
        // Optional: Auto-logout after password change
        setTimeout(() => {
          alert('Please log in again with your new password');
          handleLogout();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: `${data.message || 'Failed to change password'}` });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: 'Error changing password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="admin-settings">
      <h2>⚙️ Settings</h2>

      <div className="settings-grid">
        {/* Password Change Section */}
        <div className="settings-card">
          <h3>🔒 Change Password</h3>
          <p className="card-description">Update your admin password for better security</p>
          
          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label>Current Password *</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handleChange}
                required
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label>New Password *</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Re-enter new password"
              />
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Changing...' : '🔐 Change Password'}
            </button>
          </form>
        </div>

        {/* Account Info Section */}
        <div className="settings-card">
          <h3>👤 Account Information</h3>
          <p className="card-description">Your admin account details</p>
          
          <div className="account-info">
            <div className="info-item">
              <strong>Role:</strong>
              <span>Administrator</span>
            </div>
            <div className="info-item">
              <strong>Username:</strong>
              <span>admin</span>
            </div>
            <div className="info-item">
              <strong>Access Level:</strong>
              <span>Full Access</span>
            </div>
            <div className="info-item">
              <strong>Status:</strong>
              <span className="status-active">🟢 Active</span>
            </div>
          </div>
        </div>

        {/* Security Tips Section */}
        <div className="settings-card">
          <h3>🛡️ Security Tips</h3>
          <p className="card-description">Keep your admin account secure</p>
          
          <ul className="security-tips">
            <li>✅ Use a strong, unique password</li>
            <li>✅ Change your password regularly</li>
            <li>✅ Never share your admin credentials</li>
            <li>✅ Always logout when done</li>
            <li>✅ Use a secure internet connection</li>
          </ul>
        </div>

        {/* Logout Section */}
        <div className="settings-card logout-card">
          <h3>🚪 Logout</h3>
          <p className="card-description">Sign out of your admin account</p>
          
          <button onClick={handleLogout} className="btn btn-danger">
            🚪 Logout from Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

