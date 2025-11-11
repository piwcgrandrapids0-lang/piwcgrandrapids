import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(placeholderEvents);
    } finally {
      setLoading(false);
    }
  };

  const placeholderEvents = [
    {
      id: 1,
      title: 'Sunday Worship Service',
      date: '2025-11-16',
      time: '12:30 PM',
      location: 'Main Sanctuary',
      category: 'Worship',
      description: 'Join us for Spirit-filled worship, powerful preaching, and fellowship.',
      recurring: true
    },
    {
      id: 2,
      title: 'Prayer Night',
      date: '2025-11-18',
      time: '7:00 PM',
      location: 'Church Building',
      category: 'Prayer',
      description: 'Intercession, worship, and seeking God\'s face together.'
    },
    {
      id: 3,
      title: 'Youth Service',
      date: '2025-11-20',
      time: '6:00 PM',
      location: 'Youth Hall',
      category: 'Youth',
      description: 'Dynamic worship and relevant teaching for teens and young adults.'
    },
    {
      id: 4,
      title: 'Women\'s Fellowship',
      date: '2025-11-22',
      time: '10:00 AM',
      location: 'Fellowship Hall',
      category: 'Women',
      description: 'Bible study, prayer, and fellowship for women of all ages.'
    },
    {
      id: 5,
      title: 'Thanksgiving Service',
      date: '2025-11-28',
      time: '10:00 AM',
      location: 'Main Sanctuary',
      category: 'Special',
      description: 'Special Thanksgiving service celebrating God\'s goodness and faithfulness.'
    },
    {
      id: 6,
      title: 'Men\'s Breakfast',
      date: '2025-11-30',
      time: '8:00 AM',
      location: 'Fellowship Hall',
      category: 'Men',
      description: 'Food, fellowship, and teaching for men to grow in faith together.'
    }
  ];

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Worship: '#C41E3A',
      Prayer: '#1a1a2e',
      Youth: '#D4AF37',
      Women: '#9333EA',
      Men: '#2563EB',
      Special: '#DC2626'
    };
    return colors[category] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="events-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="container">
          <h1>Upcoming Events</h1>
          <p className="hero-text">
            Stay connected and don't miss what's happening at PIWC Grand Rapids
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="events-intro">
            <h2>What's Happening</h2>
            <p>
              From weekly worship services to special events, there's always something happening 
              at PIWC Grand Rapids. Join us and be part of our vibrant church community!
            </p>
          </div>

          {events.length > 0 ? (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-header" style={{ borderTopColor: getCategoryColor(event.category) }}>
                    <span className="event-category" style={{ background: getCategoryColor(event.category) }}>
                      {event.category}
                    </span>
                    {event.recurring && (
                      <span className="event-recurring">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                        </svg>
                        Recurring
                      </span>
                    )}
                  </div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <div className="event-details">
                      <div className="event-detail">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10z"/>
                        </svg>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="event-detail">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      <div className="event-detail">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="event-description">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>First Time Visiting?</h2>
            <p>
              We'd love to meet you! Learn what to expect and plan your visit to 
              PIWC Grand Rapids.
            </p>
            <div className="cta-buttons">
              <a href="/im-new" className="btn btn-primary">I'm New</a>
              <a href="/contact" className="btn btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;

