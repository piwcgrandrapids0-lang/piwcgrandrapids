import React, { useState, useEffect } from 'react';
import './Leadership.css';

const Leadership = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();
        setContent(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leadership:', error);
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Generate placeholder profile images using SVG with initials
  const generateProfileImage = (name, bgColor = '#003366') => {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='${encodeURIComponent(bgColor)}'/%3E%3Ctext x='50%25' y='50%25' font-size='120' fill='white' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-weight='bold'%3E${initials}%3C/text%3E%3C/svg%3E`;
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  // Helper to get full image URL
  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return null;
    // If it's an uploaded image, use backend URL
    if (photoUrl.startsWith('/uploads/')) {
      return `http://localhost:5001${photoUrl}`;
    }
    return photoUrl;
  };

  const leadPastor = content?.leadership?.leaders?.find(leader => leader.isLeadPastor) || null;
  const otherLeaders = content?.leadership?.leaders?.filter(leader => !leader.isLeadPastor) || [];

  return (
    <div className="leadership-page">
      {/* Hero Header */}
      <section className="leadership-header">
        <div className="container">
          <h1>MEET OUR LEADERSHIP</h1>
        </div>
      </section>

      {/* Intro */}
      {content?.leadership?.intro && (
        <section className="section">
          <div className="container">
            <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)' }}>
              {content.leadership.intro}
            </p>
          </div>
        </section>
      )}

      {/* Lead Pastor Section */}
      {leadPastor && (
        <section className="section lead-pastor-section">
          <div className="container">
            <div className="lead-pastor-card">
              <div className="pastor-image-container">
                <img 
                  src={getImageUrl(leadPastor.photoUrl) || generateProfileImage(leadPastor.name, '#003366')} 
                  alt={leadPastor.name}
                  className="pastor-image"
                  onError={(e) => {
                    console.log('Failed to load pastor image:', leadPastor.photoUrl);
                    e.target.src = generateProfileImage(leadPastor.name, '#003366');
                  }}
                />
              </div>
              <div className="pastor-info">
                <h2>{leadPastor.name}</h2>
                <p className="pastor-title">{leadPastor.title}</p>
                {leadPastor.email && (
                  <a 
                    href={`mailto:${leadPastor.email}`}
                    className="btn btn-contact-pastor"
                  >
                    Contact Pastor
                  </a>
                )}
                <p className="pastor-bio">{leadPastor.bio}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Leaders Grid */}
      {otherLeaders.length > 0 && (
        <section className="section leaders-grid-section">
          <div className="container">
            {content?.leadership?.teamDescription && (
              <p style={{ fontSize: '1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
                {content.leadership.teamDescription}
              </p>
            )}
            <div className="leaders-grid">
              {otherLeaders.map((leader) => (
                <div key={leader.id} className="leader-card">
                  <div className="leader-image-container">
                    <img 
                      src={getImageUrl(leader.photoUrl) || generateProfileImage(leader.name, '#2c5282')} 
                      alt={leader.name}
                      className="leader-image"
                      onError={(e) => {
                        console.log('Failed to load leader image:', leader.photoUrl);
                        e.target.src = generateProfileImage(leader.name, '#2c5282');
                      }}
                    />
                  </div>
                  <div className="leader-details">
                    <h3>{leader.name}</h3>
                    <p className="leader-role">{leader.title}</p>
                    {leader.bio && (
                      <p className="leader-bio-short">{leader.bio.substring(0, 120)}...</p>
                    )}
                    {leader.email && (
                      <a 
                        href={`mailto:${leader.email}`}
                        className="leader-contact-link"
                      >
                        Contact
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Leadership;
