import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import './AdminTenets.css';

const AdminTenets = () => {
  const [tenets, setTenets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchTenets();
  }, []);

  const fetchTenets = async () => {
    try {
      const response = await axios.get('/api/content');
      if (response.data.tenets && Array.isArray(response.data.tenets)) {
        setTenets(response.data.tenets);
      }
    } catch (error) {
      console.error('Error fetching tenets:', error);
      setMessage({ type: 'error', text: 'Failed to load tenets' });
    }
  };

  const handleTenetChange = (index, field, value) => {
    const updatedTenets = [...tenets];
    updatedTenets[index] = {
      ...updatedTenets[index],
      [field]: value
    };
    setTenets(updatedTenets);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      await axios.put('/api/content/tenets', tenets);

      setMessage({ type: 'success', text: 'Tenets updated successfully!' });
      setEditingIndex(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating tenets:', error);
      setMessage({ type: 'error', text: 'Failed to update tenets' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleCancel = () => {
    fetchTenets(); // Reload to discard changes
    setEditingIndex(null);
  };

  return (
    <div className="admin-tenets">
      <div className="section-header">
        <h2>📜 Church Tenets Management</h2>
        <p className="section-description">
          Edit the foundational beliefs and doctrines of The Church of Pentecost, USA Inc.
        </p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="tenets-list">
        {tenets.map((tenet, index) => (
          <div key={index} className="tenet-edit-card">
            <div className="tenet-header">
              <div className="tenet-number-badge">{index + 1}</div>
              <h3>{tenet.title}</h3>
            </div>

            {editingIndex === index ? (
              <div className="tenet-edit-form">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={tenet.title}
                    onChange={(e) => handleTenetChange(index, 'title', e.target.value)}
                    placeholder="Tenet title"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    value={tenet.content}
                    onChange={(e) => handleTenetChange(index, 'content', e.target.value)}
                    rows="6"
                    placeholder="Tenet content with scripture references"
                    disabled={loading}
                  />
                </div>
                <div className="form-actions">
                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? '⏳ Saving...' : '💾 Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="tenet-display">
                <p className="tenet-content-display">{tenet.content}</p>
                <button
                  onClick={() => handleEdit(index)}
                  className="btn btn-secondary btn-small"
                >
                  ✏️ Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {tenets.length === 0 && (
        <div className="empty-state">
          <p>No tenets found. Please check the content configuration.</p>
        </div>
      )}
    </div>
  );
};

export default AdminTenets;

