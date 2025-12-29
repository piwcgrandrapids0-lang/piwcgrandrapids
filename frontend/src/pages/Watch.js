import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
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

  const placeholderSermons = [];

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
              {/* Featured Sermon - Show latest or first sermon */}
              {(() => {
                const latestSermon = sermons.find(s => s.isLatest) || sermons[0];
                return (
              <div className="featured-sermon">
                <div className="featured-video">
                  {((latestSermon.messageType === 'video' || !latestSermon.messageType) && latestSermon.videoUrl) ? (
                    <>
                      <iframe
                        width="100%"
                        height="100%"
                        src={`${latestSermon.videoUrl}?feature=oembed&rel=0&modestbranding=1`}
                        title={latestSermon.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      ></iframe>
                    </>
                  ) : latestSermon.messageType === 'text' && latestSermon.textContent ? (
                    <div style={{ 
                      padding: '2rem', 
                      background: 'white', 
                      borderRadius: '8px',
                      height: '100%',
                      overflowY: 'auto',
                      lineHeight: '1.8',
                      color: 'var(--text-primary)'
                    }}>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{latestSermon.textContent}</div>
                    </div>
                  ) : latestSermon.messageType === 'slides' && latestSermon.slidesUrl ? (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: '#f5f5f5',
                      borderRadius: '8px'
                    }}>
                      {latestSermon.slidesUrl.endsWith('.pdf') ? (
                        <iframe
                          src={(() => {
                            const url = latestSermon.slidesUrl;
                            if (!url) return '';
                            if (url.startsWith('http')) return url;
                            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                            return `${API_URL}${url}`;
                          })()}
                          width="100%"
                          height="100%"
                          style={{ border: 'none', borderRadius: '8px' }}
                          title="Sermon Slides"
                        ></iframe>
                      ) : (
                        <img 
                          src={(() => {
                            const url = latestSermon.slidesUrl;
                            if (!url) return '';
                            if (url.startsWith('http')) return url;
                            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                            return `${API_URL}${url}`;
                          })()}
                          alt="Sermon Slides"
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="placeholder-video">
                      <p>Content not available</p>
                    </div>
                  )}
                </div>
                <div className="featured-info">
                  <span className="sermon-series">{latestSermon.series}</span>
                  <h3>{latestSermon.isLatest ? '⭐ ' : ''}{latestSermon.title}</h3>
                  <div className="sermon-meta">
                    <span className="sermon-speaker">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      {latestSermon.speaker}
                    </span>
                    <span className="sermon-date">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10z"/>
                      </svg>
                      {formatDate(latestSermon.date)}
                    </span>
                  </div>
                  <p className="sermon-description">{latestSermon.description}</p>
                  {latestSermon.messageType === 'slides' && latestSermon.slidesUrl && (
                    <a 
                      href={(() => {
                        const url = latestSermon.slidesUrl;
                        if (!url) return '';
                        if (url.startsWith('http')) return url;
                        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                        return `${API_URL}${url}`;
                      })()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ marginTop: '1rem', display: 'inline-block' }}
                    >
                      📥 Download Slides
                    </a>
                  )}
                </div>
              </div>
                );
              })()}

              {/* Sermon Grid */}
              <div className="sermons-grid">
                {sermons.filter(s => !s.isLatest).map((sermon) => (
                  <div key={sermon.id} className="sermon-card">
                    <div className="sermon-thumbnail">
                      {((sermon.messageType === 'video' || !sermon.messageType) && sermon.videoUrl) ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`${sermon.videoUrl}?feature=oembed&rel=0&modestbranding=1`}
                          title={sermon.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        ></iframe>
                      ) : sermon.messageType === 'text' && sermon.textContent ? (
                        <div style={{ 
                          padding: '1rem', 
                          background: 'white', 
                          height: '100%',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          color: 'var(--text-primary)'
                        }}>
                          <div>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                            <p style={{ fontSize: '0.9rem', margin: 0 }}>Text Message</p>
                          </div>
                        </div>
                      ) : sermon.messageType === 'slides' && sermon.slidesUrl ? (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: '#f5f5f5'
                        }}>
                          {sermon.slidesUrl.endsWith('.pdf') ? (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                              <p style={{ fontSize: '0.9rem', margin: 0 }}>PDF Slides</p>
                            </div>
                          ) : (
                            <img 
                              src={(() => {
                                const url = sermon.slidesUrl;
                                if (!url) return '';
                                if (url.startsWith('http')) return url;
                                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                                return `${API_URL}${url}`;
                              })()}
                              alt="Sermon Slides"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="placeholder-thumbnail">
                          <p>Content not available</p>
                        </div>
                      )}
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
