import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    isPrayerRequest: false
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const endpoint = formData.isPrayerRequest ? '/api/prayer-requests' : '/api/contact';
      await axios.post(endpoint, formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        isPrayerRequest: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p className="hero-text">
            We'd love to hear from you. Reach out with questions, prayer requests, or just to say hello!
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info-section">
              <h2>Contact Information</h2>
              
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div className="info-details">
                  <h3>Address</h3>
                  <p>
                    7003 28th Ave<br />
                    Hudsonville, MI 49426
                  </p>
                  <a href="/location-times" className="info-link">Get Directions →</a>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <div className="info-details">
                  <h3>Phone</h3>
                  <p>
                    <a href="tel:+16161234567">(616) 123-4567</a>
                  </p>
                  <p className="info-note">Call us Monday - Friday, 9 AM - 5 PM</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">✉️</div>
                <div className="info-details">
                  <h3>Email</h3>
                  <p>
                    <a href="mailto:piwcgrandrapids0@gmail.com">piwcgrandrapids0@gmail.com</a>
                  </p>
                  <p className="info-note">We'll respond within 24-48 hours</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">🕐</div>
                <div className="info-details">
                  <h3>Service Times</h3>
                  <p>
                    <strong>Sunday Worship</strong><br />
                    12:30 PM
                  </p>
                </div>
              </div>

              <div className="social-links">
                <h3>Connect With Us</h3>
                <div className="social-buttons">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn facebook">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-btn youtube">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                    </svg>
                    YouTube
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z"/>
                    </svg>
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <h2>Send Us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="alert alert-success">
                  <strong>Thank you!</strong> Your message has been sent. We'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="alert alert-error">
                  <strong>Oops!</strong> Something went wrong. Please try again or contact us directly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this regarding?"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isPrayerRequest"
                      checked={formData.isPrayerRequest}
                      onChange={handleChange}
                    />
                    <span>This is a prayer request</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

