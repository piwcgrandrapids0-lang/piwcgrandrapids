import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Watch.css';

const Watch = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const response = await axios.get('/api/sermons');
      setSermons(response.data);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      // Use placeholder data if API fails
      setSermons(placeholderSermons);
    } finally {
      setLoading(false);
    }
  };

  const placeholderSermons = [
    {
      id: 1,
      title: 'Church of Pentecost - Live Service',
      speaker: 'The Church of Pentecost',
      date: '2025-11-10',
      series: 'Sunday Worship',
      description: 'Join us for powerful worship, inspiring messages, and life-changing moments from The Church of Pentecost.',
      videoUrl: 'https://www.youtube.com/embed/e_bbZdZk7eM',
      thumbnail: 'Service Thumbnail 1'
    },
    {
      id: 2,
      title: 'Church of Pentecost - Worship & Word',
      speaker: 'The Church of Pentecost',
      date: '2025-11-03',
      series: 'Sunday Service',
      description: 'Experience spirit-filled worship and powerful preaching from The Church of Pentecost.',
      videoUrl: 'https://www.youtube.com/embed/0hui8AP1_j4',
      thumbnail: 'Service Thumbnail 2'
    },
    {
      id: 3,
      title: 'Church of Pentecost - Live Broadcast',
      speaker: 'The Church of Pentecost',
      date: '2025-10-27',
      series: 'Special Service',
      description: 'Join believers worldwide for this special service from The Church of Pentecost.',
      videoUrl: 'https://www.youtube.com/embed/wT60VvXIU44',
      thumbnail: 'Service Thumbnail 3'
    },
    {
      id: 4,
      title: 'Church of Pentecost - Sunday Service',
      speaker: 'The Church of Pentecost',
      date: '2025-10-20',
      series: 'Sunday Worship',
      description: 'Powerful ministry and worship from The Church of Pentecost headquarters.',
      videoUrl: 'https://www.youtube.com/embed/gvcRQWNAsdc',
      thumbnail: 'Service Thumbnail 4'
    }
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="watch-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading sermons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <section className="watch-hero">
        <div className="container">
          <h1>Watch & Listen</h1>
          <p className="hero-text">
            Catch up on recent messages or revisit your favorites
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="watch-intro">
            <h2>Latest Messages</h2>
            <p>
              Couldn't make it to church? Want to hear a message again? Browse our sermon 
              archive and watch or listen anytime, anywhere.
            </p>
          </div>

          {sermons.length > 0 ? (
            <>
              {/* Featured Sermon */}
              <div className="featured-sermon">
                <div className="featured-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={sermons[0].videoUrl}
                    title={sermons[0].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="featured-info">
                  <span className="sermon-series">{sermons[0].series}</span>
                  <h3>{sermons[0].title}</h3>
                  <div className="sermon-meta">
                    <span className="sermon-speaker">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      {sermons[0].speaker}
                    </span>
                    <span className="sermon-date">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10z"/>
                      </svg>
                      {formatDate(sermons[0].date)}
                    </span>
                  </div>
                  <p className="sermon-description">{sermons[0].description}</p>
                </div>
              </div>

              {/* Sermon Grid */}
              <div className="sermons-grid">
                {sermons.slice(1).map((sermon) => (
                  <div key={sermon.id} className="sermon-card">
                    <div className="sermon-thumbnail">
                      <iframe
                        width="100%"
                        height="100%"
                        src={sermon.videoUrl}
                        title={sermon.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="sermon-card-content">
                      <span className="sermon-series">{sermon.series}</span>
                      <h4>{sermon.title}</h4>
                      <div className="sermon-meta">
                        <span>{sermon.speaker}</span>
                        <span>{formatDate(sermon.date)}</span>
                      </div>
                      <p>{sermon.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-sermons">
              <p>No sermons available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <section className="section subscribe-section">
        <div className="container">
          <div className="subscribe-box">
            <h2>Never Miss a Message</h2>
            <p>
              Subscribe to our YouTube channel or podcast to get notified when we upload 
              new sermons and special messages.
            </p>
            <div className="subscribe-buttons">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                </svg>
                Subscribe on YouTube
              </a>
              <a href="/im-new" className="btn btn-secondary">Plan Your Visit</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Watch;

