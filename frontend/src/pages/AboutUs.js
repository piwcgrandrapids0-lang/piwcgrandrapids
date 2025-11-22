import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import './AboutUs.css';

const AboutUs = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/api/content');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="about-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const aboutContent = content?.about || {};

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About PIWC Grand Rapids</h1>
          <p className="hero-text">
            A community of believers passionate about worship, fellowship, and serving God
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              {aboutContent.mission && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2>Mission Statement</h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
                    {aboutContent.mission}
                  </p>
                </div>
              )}
              
              {aboutContent.vision && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2>Vision Statement</h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
                    {aboutContent.vision}
                  </p>
                </div>
              )}
              
              {aboutContent.description && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2>About Description</h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555', whiteSpace: 'pre-line' }}>
                    {aboutContent.description}
                  </p>
                </div>
              )}
              
              {!aboutContent.mission && !aboutContent.vision && !aboutContent.description && (
                <>
                  <h2>Who We Are</h2>
                  <p>
                    PIWC Grand Rapids is a vibrant congregation of The Church of Pentecost, 
                    a global denomination with a rich heritage of Pentecostal faith and practice. 
                    We are part of a worldwide family of believers united in our commitment to 
                    spreading the Gospel of Jesus Christ.
                  </p>
                  <p>
                    Our church was established to serve the Grand Rapids community and the broader 
                    West Michigan area. We are a multicultural congregation that celebrates diversity 
                    while maintaining unity in Christ. Whether you're from Ghana, the United States, 
                    or anywhere in the world, you'll find a home here.
                  </p>
                  <p>
                    At PIWC Grand Rapids, we believe that the church should be a place where people 
                    encounter God's presence, experience authentic community, and are equipped to 
                    make a difference in the world.
                  </p>
                </>
              )}
            </div>
            <div className="about-image">
              <div className="placeholder-image">
                <span>Church Community Photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Tenets Section */}
      <section className="section tenets-section" style={{ background: '#f8f9fa', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="section-title">Our Tenets</h2>
            <p className="section-subtitle" style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
              The foundational beliefs and doctrines of The Church of Pentecost, USA Inc.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555', marginBottom: '2rem' }}>
              As part of The Church of Pentecost, USA Inc., we are built upon biblical tenets that 
              guide our faith, practice, and mission. These core beliefs form the foundation of our 
              identity as a Pentecostal denomination and shape how we worship, serve, and live out our faith.
            </p>
            <Link to="/tenets" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
              📖 View All Tenets
            </Link>
          </div>
        </div>
      </section>

      <section className="section history-section">
        <div className="container">
          <h2 className="section-title">Our Story</h2>
          <div className="history-content">
            <div className="history-text">
              <h3>The Church of Pentecost</h3>
              <p>
                The Church of Pentecost is one of the fastest-growing Pentecostal denominations 
                in the world, with over 4 million members across more than 100 nations. Founded 
                in Ghana in 1953, the church has maintained a strong commitment to Pentecostal 
                beliefs, evangelism, and holiness.
              </p>
              <h3>PIWC Grand Rapids</h3>
              <p>
                Pentecost International Worship Centre (PIWC) is a ministry initiative of 
                The Church of Pentecost designed to reach diverse communities with the Gospel. 
                PIWC Grand Rapids was established to serve the multicultural population of 
                West Michigan and to provide a welcoming place for worship and fellowship.
              </p>
              <p>
                Since our founding, we have been blessed to see God work in powerful ways, 
                bringing people to faith in Christ, healing families, and transforming lives. 
                We continue to grow as we remain faithful to our calling.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section links-section">
        <div className="container">
          <h2 className="section-title">Learn More</h2>
          <div className="links-grid">
            <Link to="/beliefs" className="link-card">
              <div className="link-icon">✝️</div>
              <h3>Our Beliefs</h3>
              <p>Discover what we believe and why it matters</p>
            </Link>
            <Link to="/mission-vision" className="link-card">
              <div className="link-icon">🎯</div>
              <h3>Mission & Vision</h3>
              <p>See where we're headed and how you can be part of it</p>
            </Link>
            <Link to="/leadership" className="link-card">
              <div className="link-icon">👥</div>
              <h3>Leadership</h3>
              <p>Meet the leaders who serve our church family</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

