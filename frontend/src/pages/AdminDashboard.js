import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

// Import sub-components
import AdminGallery from '../components/Admin/AdminGallery';
import AdminContent from '../components/Admin/AdminContent';
import AdminMessages from '../components/Admin/AdminMessages';
import AdminEvents from '../components/Admin/AdminEvents';
import AdminSermons from '../components/Admin/AdminSermons';
import AdminSettings from '../components/Admin/AdminSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'gallery', name: 'Photo Gallery', icon: '📸' },
    { id: 'content', name: 'Website Content', icon: '📝' },
    { id: 'events', name: 'Events', icon: '📅' },
    { id: 'sermons', name: 'Sermons/Watch', icon: '🎥' },
    { id: 'messages', name: 'Messages & Prayers', icon: '💬' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <h1>🔐 Admin Dashboard</h1>
            <button onClick={handleLogout} className="btn btn-logout">
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <div className="container">
          <div className="tab-buttons">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-name">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          {activeTab === 'gallery' && <AdminGallery />}
          {activeTab === 'content' && <AdminContent />}
          {activeTab === 'events' && <AdminEvents />}
          {activeTab === 'sermons' && <AdminSermons />}
          {activeTab === 'messages' && <AdminMessages />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
