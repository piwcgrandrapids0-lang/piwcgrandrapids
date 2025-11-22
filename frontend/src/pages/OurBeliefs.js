import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import './OurBeliefs.css';

const OurBeliefs = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content');
        setContent(response.data.beliefs);
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
    <div className="beliefs-page">
      <section className="beliefs-hero">
        <div className="container">
          <h1>What We Believe</h1>
          <p className="hero-text">
            {content.intro || 'Our faith is built on the timeless truths of God\'s Word'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="beliefs-grid">
            {content.coreBeliefs && content.coreBeliefs.map((belief, index) => (
              <div key={index} className="belief-card">
                <div className="belief-number">{index + 1}</div>
                <h3>{belief.title}</h3>
                <p>{belief.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section section-blue">
        <div className="container">
          <h2>Want to Know More?</h2>
          <p>
            Have questions about our beliefs or want to explore faith further? 
            We'd love to connect with you!
          </p>
          <div className="cta-buttons">
            <a href="/contact" className="btn btn-primary">Contact Us</a>
            <a href="/im-new" className="btn btn-secondary">Plan Your Visit</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurBeliefs;
