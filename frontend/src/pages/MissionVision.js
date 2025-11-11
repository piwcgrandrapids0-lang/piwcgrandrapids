import React, { useState, useEffect } from 'react';
import './MissionVision.css';

const MissionVision = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();
        setContent(data.missionVision);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  if (!content) {
    return <div className="error-message">Failed to load content</div>;
  }

  return (
    <div className="mission-vision-page">
      <section className="mv-hero">
        <div className="container">
          <h1>Our Mission & Vision</h1>
          <p className="hero-text">
            Guided by God's Word, empowered by His Spirit, and driven by His love
          </p>
        </div>
      </section>

      <section className="section mission-section">
        <div className="container">
          <div className="mv-card mission-card">
            <div className="mv-icon">🎯</div>
            <h2>{content.mission.title}</h2>
            <p className="mv-statement">
              {content.mission.statement}
            </p>
            <div className="mv-details">
              <p>{content.mission.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section vision-section">
        <div className="container">
          <div className="mv-card vision-card">
            <div className="mv-icon">🌟</div>
            <h2>{content.vision.title}</h2>
            <p className="mv-statement">
              {content.vision.statement}
            </p>
            <div className="mv-details">
              <p>{content.vision.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle">
            These values guide everything we do as a church
          </p>
          <div className="values-grid">
            {content.values && content.values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-number">{index + 1}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section section-blue">
        <div className="container">
          <div className="cta-content">
            <h2>Join Us in Fulfilling Our Mission</h2>
            <p>
              We invite you to be part of what God is doing at PIWC Grand Rapids. 
              Whether you're looking for a church home or want to get involved in ministry, 
              there's a place for you here.
            </p>
            <div className="cta-buttons">
              <a href="/im-new" className="btn btn-primary">Plan Your Visit</a>
              <a href="/ministries" className="btn btn-secondary">Explore Ministries</a>
              <a href="/contact" className="btn btn-gold">Get in Touch</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MissionVision;
