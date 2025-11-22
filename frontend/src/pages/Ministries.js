import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import './Ministries.css';

const Ministries = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/api/content');
      setContent(response.data.ministries);
    } catch (error) {
      console.error('Error fetching ministries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // If it's already a full URL (starts with http), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it's an Azure Blob Storage URL, return as is
    if (imageUrl.includes('blob.core.windows.net')) {
      return imageUrl;
    }
    // Otherwise, prepend the API URL for local uploads
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    return `${apiUrl}${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="ministries-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading ministries...</p>
        </div>
      </div>
    );
  }

  const ministries = content?.list || [];

  return (
    <div className="ministries-page">
      <section className="ministries-hero">
        <div className="container">
          <h1>Get Involved</h1>
          <p className="hero-text">
            Find your place in our church family through meaningful ministry and service
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ministries-intro">
            <h2>Discover Your Ministry</h2>
            {content?.intro ? (
              <p>{content.intro}</p>
            ) : (
              <>
                <p>
                  At PIWC Grand Rapids, we believe that every member is called to serve. God has 
                  uniquely gifted you to make a difference in His kingdom. Whether you're passionate 
                  about working with children, leading worship, serving the community, or praying for 
                  others, there's a place for you to use your gifts and talents.
                </p>
                <p>
                  Browse our ministries below and find where you can plug in and make an impact!
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section ministries-section">
        <div className="container">
          {ministries.length > 0 ? (
            ministries.map((ministry, index) => (
              <div key={index} className={`ministry-detailed ${index % 2 === 1 ? 'reverse' : ''}`}>
                <div className="ministry-info">
                  <div className="ministry-header">
                    <div>
                      <h2>{ministry.name}</h2>
                    </div>
                  </div>
                  <p className="ministry-description">{ministry.description}</p>
                </div>
                <div className="ministry-image">
                  {ministry.imageUrl ? (
                    <img 
                      src={getImageUrl(ministry.imageUrl)} 
                      alt={ministry.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="placeholder-ministry-image"
                    style={{ display: ministry.imageUrl ? 'none' : 'flex' }}
                  >
                    <span>{ministry.name} Photo</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-ministries">
              <p>No ministries available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <section className="section join-section">
        <div className="container">
          <div className="join-box">
            <h2>Ready to Get Involved?</h2>
            <p>
              We'd love to help you find the perfect ministry fit! Contact us to learn more 
              about serving opportunities and how you can make a difference.
            </p>
            <div className="join-buttons">
              <a href="/contact" className="btn btn-primary">Contact Us</a>
              <a href="/im-new" className="btn btn-secondary">I'm New Here</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ministries;

