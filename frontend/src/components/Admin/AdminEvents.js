import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import './AdminEvents.css';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'general',
    recurrenceType: 'one-time',
    flyerUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    { id: 'general', name: 'General Event' },
    { id: 'worship', name: 'Worship Service' },
    { id: 'prayer', name: 'Prayer Meeting' },
    { id: 'youth', name: 'Youth Event' },
    { id: 'outreach', name: 'Community Outreach' },
    { id: 'special', name: 'Special Occasion' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('uploadType', 'images'); // Store flyers in images folder

    setUploading(true);
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.url) {
        setFormData(prev => ({ ...prev, flyerUrl: response.data.url }));
        alert(`Flyer uploaded successfully!`);
        return response.data.url;
      } else {
        alert(`Upload failed: ${response.data.error}`);
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      
      if (editingEvent) {
        await axios.put(url, formData);
      } else {
        await axios.post(url, formData);
      }
      
      fetchEvents();
      resetForm();
      alert(editingEvent ? 'Event updated!' : 'Event created!');
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      category: event.category,
      recurrenceType: event.recurrenceType || 'one-time',
      flyerUrl: event.flyerUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`/api/events/${eventId}`);
      fetchEvents();
      alert('Event deleted!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      category: 'general',
      recurrenceType: 'one-time',
      flyerUrl: ''
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  return (
    <div className="admin-events">
      <div className="section-header">
        <h2>Events Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-gold">
          {showForm ? '✕ Cancel' : '➕ Add Event'}
        </button>
      </div>

      {showForm && (
        <div className="event-form-container">
          <h3>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-row">
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Sunday Worship Service"
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Main Sanctuary"
              />
            </div>

            <div className="form-group">
              <label>Event Type *</label>
              <select 
                name="recurrenceType" 
                value={formData.recurrenceType} 
                onChange={handleChange} 
                required
              >
                <option value="one-time">One-Time Event</option>
                <option value="recurring">Recurring Event</option>
                <option value="occasional">Occasional Event</option>
              </select>
              <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                {formData.recurrenceType === 'recurring' && 'Event happens regularly (e.g., every Sunday)'}
                {formData.recurrenceType === 'one-time' && 'Single occurrence event'}
                {formData.recurrenceType === 'occasional' && 'Event happens occasionally (e.g., quarterly)'}
              </small>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Event description..."
              />
            </div>

            <div className="form-group">
              <label>Event Flyer</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <input
                    type="text"
                    name="flyerUrl"
                    value={formData.flyerUrl}
                    onChange={handleChange}
                    placeholder="/uploads/images/event-flyer.jpg"
                  />
                  <small>Flyer URL (auto-filled after upload)</small>
                </div>
                <div>
                  <label 
                    htmlFor="flyerUpload" 
                    className="btn btn-secondary" 
                    style={{ cursor: 'pointer', margin: 0 }}
                  >
                    {uploading ? '⏳ Uploading...' : '📤 Upload Flyer'}
                  </label>
                  <input
                    id="flyerUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = await handleFileUpload(file);
                        if (url) {
                          setFormData(prev => ({ ...prev, flyerUrl: url }));
                        }
                      }
                    }}
                    disabled={uploading}
                  />
                </div>
              </div>
              {formData.flyerUrl && (
                <div style={{ marginTop: '1rem' }}>
                  <img 
                    src={formData.flyerUrl.startsWith('http') ? formData.flyerUrl : `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${formData.flyerUrl}`}
                    alt="Flyer Preview" 
                    style={{ maxWidth: '300px', maxHeight: '400px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #ddd' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingEvent ? '💾 Update Event' : '➕ Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="events-list">
        <h3>All Events ({events.length})</h3>
        {events.length === 0 ? (
          <div className="empty-state">
            <p>No events yet. Create your first event!</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h4>{event.title}</h4>
                  <span className="event-category">{categories.find(c => c.id === event.category)?.name}</span>
                </div>
                <div className="event-details">
                  <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>🕐 Time:</strong> {event.time}</p>
                  <p><strong>📍 Location:</strong> {event.location}</p>
                  <p><strong>Type:</strong> 
                    <span style={{ 
                      marginLeft: '8px', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.85em',
                      background: event.recurrenceType === 'recurring' ? '#e3f2fd' : 
                                  event.recurrenceType === 'occasional' ? '#fff3e0' : '#f3e5f5',
                      color: event.recurrenceType === 'recurring' ? '#1976d2' : 
                             event.recurrenceType === 'occasional' ? '#f57c00' : '#7b1fa2'
                    }}>
                      {event.recurrenceType === 'recurring' ? '🔄 Recurring' : 
                       event.recurrenceType === 'occasional' ? '📅 Occasional' : '📌 One-Time'}
                    </span>
                  </p>
                  <p><strong>Description:</strong> {event.description}</p>
                  {event.flyerUrl && (
                    <div style={{ marginTop: '1rem' }}>
                      <strong>📄 Flyer:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        <img 
                          src={event.flyerUrl.startsWith('http') ? event.flyerUrl : `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${event.flyerUrl}`}
                          alt={`${event.title} Flyer`}
                          style={{ maxWidth: '200px', maxHeight: '250px', borderRadius: '4px', objectFit: 'contain', border: '1px solid #ddd' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="event-actions">
                  <button onClick={() => handleEdit(event)} className="btn btn-secondary btn-small">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="btn btn-danger btn-small">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;

