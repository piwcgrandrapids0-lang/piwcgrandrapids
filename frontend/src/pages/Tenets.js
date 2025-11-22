import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import './Tenets.css';

const Tenets = () => {
  const [tenets, setTenets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenets = async () => {
      try {
        const response = await axios.get('/api/content');
        if (response.data.tenets && Array.isArray(response.data.tenets)) {
          setTenets(response.data.tenets);
        }
      } catch (error) {
        console.error('Error fetching tenets:', error);
        // Fallback to default tenets if API fails
        setTenets([
          {
            title: "THE BIBLE",
            content: "We believe in the divine inspiration and authority of the Holy Scriptures. We believe that the Bible is infallible in its declaration, final in its authority, all-sufficient in its provisions and comprehensive in its sufficiency (2 Timothy 3:16; 2 Peter 1:21)."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTenets();
  }, []);

  return (
    <div className="tenets-page">
      <section className="tenets-hero">
        <div className="container">
          <h1>Tenets of The Church of Pentecost, USA Inc.</h1>
          <p className="hero-subtitle">
            Our foundational beliefs and doctrines
          </p>
        </div>
      </section>

      <section className="section tenets-content">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading tenets...</p>
            </div>
          ) : (
            <>
              <div className="tenets-intro">
                <p>
                  The Church of Pentecost, USA Inc. is built upon these foundational tenets 
                  that guide our faith, practice, and mission. These beliefs are rooted in 
                  Scripture and form the basis of our identity as a Pentecostal denomination.
                </p>
              </div>

              <div className="tenets-grid">
                {tenets.map((tenet, index) => (
                  <div key={index} className="tenet-card">
                    <div className="tenet-number">{index + 1}</div>
                    <h2 className="tenet-title">{tenet.title}</h2>
                    <p className="tenet-content">{tenet.content}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tenets;

