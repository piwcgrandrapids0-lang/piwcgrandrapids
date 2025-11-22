import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import './AdminMessages.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [activeTab, setActiveTab] = useState('messages');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchMessages();
    fetchPrayers();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/contact/messages');
      // Ensure data is an array
      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]); // Set empty array on error
    }
  };

  const fetchPrayers = async () => {
    try {
      const response = await axios.get('/api/prayer-requests');
      // Ensure data is an array
      setPrayers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching prayers:', error);
      setPrayers([]); // Set empty array on error
    }
  };

  const markAsRead = async (id, isPrayer = false) => {
    try {
      const endpoint = isPrayer 
        ? `/api/prayer-requests/${id}/read`
        : `/api/contact/messages/${id}/read`;
      
      await axios.patch(endpoint, { read: true });
      
      if (isPrayer) {
        fetchPrayers();
      } else {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      alert('Failed to mark as read');
    }
  };

  const markAsUnread = async (id, isPrayer = false) => {
    try {
      const endpoint = isPrayer 
        ? `/api/prayer-requests/${id}/read`
        : `/api/contact/messages/${id}/read`;
      
      await axios.patch(endpoint, { read: false });
      
      if (isPrayer) {
        fetchPrayers();
      } else {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error marking as unread:', error);
      alert('Failed to mark as unread');
    }
  };

  // Filter messages/prayers based on read status
  const getFilteredItems = (items) => {
    if (filter === 'all') return items;
    if (filter === 'unread') return items.filter(item => !item.read);
    if (filter === 'read') return items.filter(item => item.read);
    return items;
  };

  // Get counts
  const unreadMessages = messages.filter(m => !m.read).length;
  const readMessages = messages.filter(m => m.read).length;
  const unreadPrayers = prayers.filter(p => !p.read).length;
  const readPrayers = prayers.filter(p => p.read).length;

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
          {unreadMessages > 0 && <span className="unread-badge">{unreadMessages}</span>}
        </button>
        <button
          onClick={() => setActiveTab('prayers')}
          className={`tab-btn ${activeTab === 'prayers' ? 'active' : ''}`}
        >
          🙏 Prayer Requests ({prayers.length})
          {unreadPrayers > 0 && <span className="unread-badge">{unreadPrayers}</span>}
        </button>
      </div>

      {/* Filter buttons */}
      <div className="filter-buttons" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
        >
          Unread ({activeTab === 'messages' ? unreadMessages : unreadPrayers})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
        >
          Read ({activeTab === 'messages' ? readMessages : readPrayers})
        </button>
      </div>

      {activeTab === 'messages' && (
        <div className="messages-list">
          {getFilteredItems(messages).length === 0 ? (
            <div className="empty-state">
              <p>{filter === 'all' ? 'No contact messages yet' : `No ${filter} messages`}</p>
            </div>
          ) : (
            getFilteredItems(messages).map(message => (
              <div key={message.id} className={`message-card ${message.read ? 'read' : 'unread'}`}>
                <div className="message-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h4>{message.name}</h4>
                    {!message.read && <span className="unread-indicator">NEW</span>}
                    {message.read && <span className="read-indicator">READ</span>}
                  </div>
                  <span className="message-date">
                    {new Date(message.createdAt).toLocaleDateString()}
                    {message.readAt && (
                      <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '10px' }}>
                        (Read: {new Date(message.readAt).toLocaleDateString()})
                      </span>
                    )}
                  </span>
                </div>
                <div className="message-body">
                  <p><strong>Email:</strong> <a href={`mailto:${message.email}`}>{message.email}</a></p>
                  {message.phone && <p><strong>Phone:</strong> {message.phone}</p>}
                  <p><strong>Subject:</strong> {message.subject}</p>
                  <p><strong>Message:</strong></p>
                  <p className="message-text">{message.message}</p>
                </div>
                <div className="message-actions" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                  {!message.read ? (
                    <button 
                      onClick={() => markAsRead(message.id, false)}
                      className="btn-mark-read"
                      style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ✓ Mark as Read
                    </button>
                  ) : (
                    <button 
                      onClick={() => markAsUnread(message.id, false)}
                      className="btn-mark-unread"
                      style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ↺ Mark as Unread
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'prayers' && (
        <div className="messages-list">
          {getFilteredItems(prayers).length === 0 ? (
            <div className="empty-state">
              <p>{filter === 'all' ? 'No prayer requests yet' : `No ${filter} prayer requests`}</p>
            </div>
          ) : (
            getFilteredItems(prayers).map(prayer => (
              <div key={prayer.id} className={`message-card ${prayer.isUrgent ? 'urgent' : ''} ${prayer.read ? 'read' : 'unread'}`}>
                <div className="message-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h4>{prayer.name}</h4>
                    {prayer.isUrgent && <span className="urgent-badge">URGENT</span>}
                    {!prayer.read && <span className="unread-indicator">NEW</span>}
                    {prayer.read && <span className="read-indicator">READ</span>}
                  </div>
                  <span className="message-date">
                    {new Date(prayer.createdAt).toLocaleDateString()}
                    {prayer.readAt && (
                      <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '10px' }}>
                        (Read: {new Date(prayer.readAt).toLocaleDateString()})
                      </span>
                    )}
                  </span>
                </div>
                <div className="message-body">
                  <p><strong>Email:</strong> <a href={`mailto:${prayer.email}`}>{prayer.email}</a></p>
                  {prayer.phone && <p><strong>Phone:</strong> {prayer.phone}</p>}
                  <p><strong>Subject:</strong> {prayer.subject}</p>
                  <p><strong>Prayer Request:</strong></p>
                  <p className="message-text">{prayer.message}</p>
                </div>
                <div className="message-actions" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                  {!prayer.read ? (
                    <button 
                      onClick={() => markAsRead(prayer.id, true)}
                      className="btn-mark-read"
                      style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ✓ Mark as Read
                    </button>
                  ) : (
                    <button 
                      onClick={() => markAsUnread(prayer.id, true)}
                      className="btn-mark-unread"
                      style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ↺ Mark as Unread
                    </button>
                  )}
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

