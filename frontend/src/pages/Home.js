import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import './Home.css';

const Home = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content');
        setContent(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Helper to get full image URL for uploaded images
  const getImageUrl = (url) => {
    if (!url) return url;
    if (url.startsWith('/uploads/')) {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      return `${API_URL}${url}`;
    }
    return url;
  };

  const getEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return null;

    url = url.trim();
    
    if (url === 'https://www.youtube.com/' || url === 'https://youtube.com/' || url.includes('youtube.com/@')) {
      return null; 
    }

    if (url.includes('youtube.com/embed/')) {
      const embedMatch = url.match(/embed\/([^?&]+)/);
      if (embedMatch && embedMatch[1]) {
        const videoId = embedMatch[1];

        if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      return null;
    }

    let videoId = null;

    const watchMatch = url.match(/(?:[?&]v=|v\/)([^&?#]+)/);
    if (watchMatch && watchMatch[1]) {
      videoId = watchMatch[1].split('&')[0].split('#')[0];
    }
    
    if (!videoId) {
      const liveMatch = url.match(/youtube\.com\/live\/([^?&#]+)/);
      if (liveMatch && liveMatch[1]) {
        videoId = liveMatch[1];
      }
    }
    
    
    if (!videoId) {
      const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
      if (shortMatch && shortMatch[1]) {
        videoId = shortMatch[1];
      }
    }
    
    
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return null;
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1 className="hero-title">{content?.hero?.title || 'Welcome to PIWC Grand Rapids'}</h1>
          <p className="hero-subtitle">
            {content?.hero?.subtitle || 'The Church of Pentecost - Where Faith Meets Fellowship'}
          </p>
          <p className="hero-text">
            {content?.hero?.description || 'Join us every Sunday at 12:30 PM for worship, prayer, and community'}
          </p>
          <div className="hero-buttons">
            <Link to="/im-new" className="btn btn-primary">Plan Your Visit</Link>
            <Link to="/location-times" className="btn btn-secondary">Get Directions</Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="section welcome-section">
        <div className="container">
          <div className="welcome-content">
            <div className="welcome-text">
              <h2>{content?.welcomeHome?.title || 'Welcome Home'}</h2>
              <p>{content?.welcomeHome?.paragraph1 || 'At PIWC Grand Rapids, we believe that church is more than just a building - it\'s a family.'}</p>
              <p>{content?.welcomeHome?.paragraph2 || 'We are part of The Church of Pentecost, a global denomination committed to spreading the gospel of Jesus Christ.'}</p>
              <Link to={content?.welcomeHome?.buttonLink || '/about'} className="btn btn-primary">
                {content?.welcomeHome?.buttonText || 'Learn More About Us'}
              </Link>
            </div>
            <div className="welcome-image">
              {content?.welcomeHome?.imageUrl ? (
                <img 
                  src={getImageUrl(content.welcomeHome.imageUrl)} 
                  alt="Church Building" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  onError={(e) => {
                    console.log('Failed to load welcome image:', content.welcomeHome.imageUrl);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="placeholder-image" style={{ display: content?.welcomeHome?.imageUrl ? 'none' : 'flex' }}>
                <span>Church Building Photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Church Theme Section */}
      {content?.themes && Object.keys(content.themes).find(year => content.themes[year]?.active) && (
        <section className="section theme-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4rem 0' }}>
          <div className="container">
            {Object.keys(content.themes).map(year => {
              const theme = content.themes[year];
              if (!theme?.active) return null;
              
              return (
                <div key={year} className="theme-card" style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '3rem',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    {year} Annual Theme
                  </div>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                    {theme.title}
                  </h2>
                  {theme.scripture && (
                    <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontStyle: 'italic', opacity: 0.95 }}>
                      {theme.scripture}
                    </p>
                  )}
                  {theme.description && (
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
                      {theme.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Service Times Section */}
      <section className="section service-times-section">
        <div className="container">
          <h2 className="section-title">Join Us This Sunday</h2>
          <div className="service-times-grid">
            <div className="service-card">
              <div className="service-icon">🕐</div>
              <h3>Sunday Worship</h3>
              <p className="service-time">{content?.services?.sunday?.time || '12:30 PM'}</p>
              <p>{content?.services?.sunday?.description || 'Experience powerful worship, inspiring messages, and warm fellowship'}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📍</div>
              <h3>Location</h3>
              <p className="service-location">{content?.contact?.address?.street || '7003 28th Ave'}</p>
              <p>{content?.contact?.address?.city || 'Hudsonville'}, {content?.contact?.address?.state || 'MI'} {content?.contact?.address?.zip || '49426'}</p>
              <Link to="/location-times" className="service-link">Get Directions →</Link>
            </div>
            <div className="service-card">
              <div className="service-icon">👨‍👩‍👧‍👦</div>
              <h3>All Are Welcome</h3>
              <p className="service-time">Every Age</p>
              <p>Programs for kids, youth, and adults - everyone has a place here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tenets Section */}
      <section className="section tenets-preview-section" style={{ background: '#f8f9fa', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="section-title">Our Tenets</h2>
            <p className="section-subtitle" style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
              The foundational beliefs and doctrines of The Church of Pentecost, USA Inc.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555', marginBottom: '2rem' }}>
              We are built upon biblical tenets that guide our faith, practice, and mission. 
              These core beliefs form the foundation of our identity as a Pentecostal denomination 
              and shape how we worship, serve, and live out our faith.
            </p>
            <Link to="/tenets" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
              📖 View All Tenets
            </Link>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="section expect-section">
        <div className="container">
          <h2 className="section-title">{content?.whatToExpect?.title || 'What to Expect'}</h2>
          <p className="section-subtitle">
            {content?.whatToExpect?.subtitle || 'First time visiting? Here\'s what a typical Sunday looks like'}
          </p>
          <div className="expect-grid">
            {content?.whatToExpect?.steps && content.whatToExpect.steps.map((step, index) => (
              <div key={index} className="expect-card">
                <div className="expect-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
          <div className="expect-cta">
            <Link to="/im-new" className="btn btn-gold">I'm New - Learn More</Link>
          </div>
        </div>
      </section>

      {/* Ministries Preview */}
      <section className="section ministries-preview">
        <div className="container">
          <h2 className="section-title">Get Connected</h2>
          <p className="section-subtitle">
            Find your place in our church family through our ministries
          </p>
          <div className="ministries-grid">
            <div className="ministry-card">
              <div className="ministry-icon">👶</div>
              <h3>PIWC Kids</h3>
              <p>Fun, age-appropriate lessons and activities for children</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">🎸</div>
              <h3>Youth Ministry</h3>
              <p>Empowering the next generation through faith and fellowship</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">👨</div>
              <h3>Men's Ministry</h3>
              <p>Building strong, godly men through brotherhood and discipleship</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">👩</div>
              <h3>Women's Ministry</h3>
              <p>Connecting women in faith, friendship, and spiritual growth</p>
            </div>
          </div>
          <div className="ministries-cta">
            <Link to="/ministries" className="btn btn-primary">Explore All Ministries</Link>
          </div>
        </div>
      </section>

      {/* Latest Sermon */}
      {content?.latestMessage?.enabled && (
        <section className="section latest-sermon">
          <div className="container">
            <h2 className="section-title">{content?.latestMessage?.title || 'Latest Message'}</h2>
            <div className="sermon-container">
              <div className="sermon-video">
                {getEmbedUrl(content?.latestMessage?.sermon?.videoUrl) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`${getEmbedUrl(content.latestMessage.sermon.videoUrl)}?feature=oembed&rel=0&modestbranding=1`}
                    title={content.latestMessage.sermon.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{ borderRadius: '8px' }}
                  ></iframe>
                ) : null}
                <div className="placeholder-video" style={{ display: getEmbedUrl(content?.latestMessage?.sermon?.videoUrl) ? 'none' : 'flex' }}>
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>⚠️ Video Not Available</p>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                      {content?.latestMessage?.sermon?.videoUrl ? 
                        'This video may be private, unavailable, or embedding may be disabled.' : 
                        'No video URL provided.'}
                    </p>
                    {content?.latestMessage?.sermon?.videoUrl && (
                      <a 
                        href={content.latestMessage.sermon.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ display: 'inline-block' }}
                      >
                        Watch on YouTube
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="sermon-info">
                <h3>{content?.latestMessage?.sermon?.category || 'Sunday Service'}</h3>
                <p className="sermon-title">{content?.latestMessage?.sermon?.title || 'Walking in Faith and Purpose'}</p>
                <p className="sermon-date">
                  {content?.latestMessage?.sermon?.speaker && `${content.latestMessage.sermon.speaker} • `}
                  {content?.latestMessage?.sermon?.date || 'November 10, 2025'}
                </p>
                <p className="sermon-description">
                  {content?.latestMessage?.sermon?.description || 'Discover how to live a life of faith and walk in your God-given purpose.'}
                </p>
                <Link to="/watch" className="btn btn-primary">Watch More Sermons</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Take the Next Step?</h2>
            <p>
              Whether you're visiting for the first time or looking to get more involved, 
              we're here to help you on your journey.
            </p>
            <div className="cta-buttons">
              <Link to="/im-new" className="btn btn-primary">Plan Your Visit</Link>
              <a 
                href="https://tithe.ly/give/?c=1373113&k=1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-gold"
              >
                Give Online
              </a>
              <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

