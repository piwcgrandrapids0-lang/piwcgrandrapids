import React, { useState, useEffect } from 'react';
import './AdminMessages.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [activeTab, setActiveTab] = useState('messages');

  useEffect(() => {
    fetchMessages();
    fetchPrayers();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/contact', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      // Ensure data is an array
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]); // Set empty array on error
    }
  };

  const fetchPrayers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/prayer-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      // Ensure data is an array
      setPrayers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching prayers:', error);
      setPrayers([]); // Set empty array on error
    }
  };

  return (
    <div className="admin-messages">
      <h2>💬 Messages & Prayer Requests</h2>
      <p className="section-description">
        View contact messages and prayer requests from your congregation
      </p>

      <div className="message-tabs">
        <button
          onClick={() => setActiveTab('messages')}
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
        >
          📧 Contact Messages ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('prayers')}
          className={`tab-btn ${activeTab === 'prayers' ? 'active' : ''}`}
        >
          🙏 Prayer Requests ({prayers.length})
        </button>
      </div>

      {activeTab === 'messages' && (
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>No contact messages yet</p>
            </div>
          ) : (
            messages.map(message => (
              <div key={message.id} className="message-card">
                <div className="message-header">
                  <h4>{message.name}</h4>
                  <span className="message-date">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="message-body">
                  <p><strong>Email:</strong> <a href={`mailto:${message.email}`}>{message.email}</a></p>
                  {message.phone && <p><strong>Phone:</strong> {message.phone}</p>}
                  <p><strong>Subject:</strong> {message.subject}</p>
                  <p><strong>Message:</strong></p>
                  <p className="message-text">{message.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'prayers' && (
        <div className="messages-list">
          {prayers.length === 0 ? (
            <div className="empty-state">
              <p>No prayer requests yet</p>
            </div>
          ) : (
            prayers.map(prayer => (
              <div key={prayer.id} className={`message-card ${prayer.isUrgent ? 'urgent' : ''}`}>
                <div className="message-header">
                  <h4>{prayer.name} {prayer.isUrgent && <span className="urgent-badge">URGENT</span>}</h4>
                  <span className="message-date">
                    {new Date(prayer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="message-body">
                  <p><strong>Email:</strong> <a href={`mailto:${prayer.email}`}>{prayer.email}</a></p>
                  {prayer.phone && <p><strong>Phone:</strong> {prayer.phone}</p>}
                  <p><strong>Subject:</strong> {prayer.subject}</p>
                  <p><strong>Prayer Request:</strong></p>
                  <p className="message-text">{prayer.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;

