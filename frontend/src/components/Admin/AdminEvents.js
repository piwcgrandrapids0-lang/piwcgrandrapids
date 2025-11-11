import React, { useState, useEffect } from 'react';
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
    category: 'general'
  });

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
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchEvents();
        resetForm();
        alert(editingEvent ? 'Event updated!' : 'Event created!');
      }
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
      category: event.category
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchEvents();
        alert('Event deleted!');
      }
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
      category: 'general'
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
                  <p><strong>Description:</strong> {event.description}</p>
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

