import React, { useEffect } from 'react';
import './Give.css';

const Give = () => {
  // Redirect to Tithe.ly on component mount
  useEffect(() => {
    window.location.href = 'https://tithe.ly/give/?c=1373113&k=1';
  }, []);

  return (
    <div className="give-page">
      <section className="give-hero">
        <div className="container">
          <h1>Redirecting to Secure Giving Platform...</h1>
          <p className="hero-text">
            You are being redirected to our secure Tithe.ly giving platform.
          </p>
          <p className="hero-text" style={{ marginTop: '2rem' }}>
            If you are not redirected automatically, please{' '}
            <a 
              href="https://tithe.ly/give/?c=1373113&k=1" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--primary-yellow)', textDecoration: 'underline' }}
            >
              click here
            </a>
            .
          </p>
        </div>
      </section>

      <section className="section" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 2rem' }}></div>
          <h2>Connecting to Secure Platform...</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Thank you for your generosity! 🙏
          </p>
        </div>
      </section>
    </div>
  );
};

export default Give;

