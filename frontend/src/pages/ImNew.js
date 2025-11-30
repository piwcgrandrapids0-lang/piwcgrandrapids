import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import './ImNew.css';

const ImNew = () => {
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
      <div className="im-new-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const imNewContent = content?.imNew || {};
  const contactInfo = content?.contact || {};
  const services = content?.services || {};

  return (
    <div className="im-new-page">
      {/* Hero Section */}
      <section className="im-new-hero">
        <div className="container">
          <h1>{imNewContent.welcome?.title || "We're Glad You're Here!"}</h1>
          <p className="hero-text">
            {imNewContent.welcome?.message || "Whether this is your first time visiting or you're just learning about us, we want to make your experience as comfortable as possible."}
          </p>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">What to Expect</h2>
          {imNewContent.whatToExpect?.intro && (
            <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', color: '#666' }}>
              {imNewContent.whatToExpect.intro}
            </p>
          )}
          <div className="expect-grid">
            {imNewContent.whatToExpect?.steps && imNewContent.whatToExpect.steps.length > 0 ? (
              imNewContent.whatToExpect.steps.map((step, index) => (
                <div key={index} className="expect-item">
                  <div className="expect-icon">{(index + 1)}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))
            ) : (
              // Fallback to default content if no steps are configured
              <>
                <div className="expect-item">
                  <div className="expect-icon">👋</div>
                  <h3>Warm Welcome</h3>
                  <p>
                    As you arrive, our friendly greeters will welcome you with a smile. 
                    They'll be happy to answer any questions and help you find your way around.
                  </p>
                </div>
                <div className="expect-item">
                  <div className="expect-icon">⏰</div>
                  <h3>Service Duration</h3>
                  <p>
                    Our Sunday service begins at 12:30 PM and typically lasts about 2 hours, 
                    including worship, prayer, and a message from God's Word.
                  </p>
                </div>
                <div className="expect-item">
                  <div className="expect-icon">👔</div>
                  <h3>Dress Code</h3>
                  <p>
                    Come as you are! While some people dress formally, others prefer casual attire. 
                    The most important thing is that you feel comfortable.
                  </p>
                </div>
                <div className="expect-item">
                  <div className="expect-icon">👶</div>
                  <h3>Kids Program</h3>
                  <p>
                    We have age-appropriate programs for children during the service. 
                    Your kids will have fun while learning about Jesus in a safe environment.
                  </p>
                </div>
                <div className="expect-item">
                  <div className="expect-icon">☕</div>
                  <h3>Fellowship Time</h3>
                  <p>
                    After the service, join us for refreshments and fellowship. 
                    It's a great opportunity to meet people and make new friends.
                  </p>
                </div>
                <div className="expect-item">
                  <div className="expect-icon">🅿️</div>
                  <h3>Parking</h3>
                  <p>
                    Free parking is available on-site. Our parking team will help guide you 
                    to available spots when you arrive.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {imNewContent.faq && imNewContent.faq.length > 0 ? (
              imNewContent.faq.map((item, index) => (
                <div key={index} className="faq-item">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))
            ) : (
              // Fallback to default FAQ if none are configured
              <>
                <div className="faq-item">
                  <h3>What time should I arrive?</h3>
                  <p>
                    We recommend arriving 10-15 minutes before the service starts at 12:30 PM. 
                    This gives you time to find parking, get settled, and meet our welcome team.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>What's the worship style like?</h3>
                  <p>
                    Our worship combines contemporary and traditional elements. We sing a mix of 
                    hymns and modern worship songs, accompanied by a live band.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Is there a place for my kids?</h3>
                  <p>
                    Yes! We offer PIWC Kids programs for children from nursery through elementary school. 
                    Your children will be cared for by our trained volunteers in a safe, fun environment.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Can I watch services online?</h3>
                  <p>
                    Absolutely! We livestream our services and archive them on our Watch page. 
                    You can catch up on any messages you missed or rewatch your favorites.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Do I have to give money?</h3>
                  <p>
                    Not at all! Giving is an act of worship for our members, but as a guest, 
                    you should never feel pressured to give. You're our guest!
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Plan Your Visit */}
      <section className="section plan-visit-section">
        <div className="container">
          <h2 className="section-title">Plan Your Visit</h2>
          <div className="visit-info">
            <div className="visit-card">
              <h3>Sunday Service</h3>
              <div className="visit-detail">
                <strong>Time:</strong> {services.sunday?.time || '12:30 PM'}
              </div>
              <div className="visit-detail">
                <strong>Location:</strong><br />
                {contactInfo.address?.street || '7003 28th Ave'}<br />
                {contactInfo.address?.city || 'Hudsonville'}, {contactInfo.address?.state || 'MI'} {contactInfo.address?.zip || '49426'}
              </div>
              <Link to="/location-times" className="btn btn-primary">Get Directions</Link>
            </div>
            <div className="visit-card">
              <h3>Contact Us</h3>
              <div className="visit-detail">
                <strong>Phone:</strong> {contactInfo.phone || '(616) 123-4567'}
              </div>
              <div className="visit-detail">
                <strong>Email:</strong> {contactInfo.email || 'piwcgrandrapids0@gmail.com'}
              </div>
              <div className="visit-detail">
                Have questions? We'd love to hear from you!
              </div>
              <Link to="/contact" className="btn btn-secondary">Send a Message</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="section next-steps-section">
        <div className="container">
          <h2 className="section-title">{imNewContent.nextSteps?.title || "Ready for the Next Step?"}</h2>
          {imNewContent.nextSteps?.description && (
            <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', color: '#666' }}>
              {imNewContent.nextSteps.description}
            </p>
          )}
          <div className="next-steps-grid">
            {imNewContent.nextSteps?.steps && imNewContent.nextSteps.steps.length > 0 ? (
              imNewContent.nextSteps.steps.map((step, index) => (
                <div key={index} className="next-step-card">
                  <div className="step-number">{index + 1}</div>
                  <h3>{step}</h3>
                </div>
              ))
            ) : (
              // Fallback to default next steps if none are configured
              <>
                <div className="next-step-card">
                  <div className="step-number">1</div>
                  <h3>Attend a Service</h3>
                  <p>Join us this Sunday and experience our community firsthand</p>
                </div>
                <div className="next-step-card">
                  <div className="step-number">2</div>
                  <h3>Connect</h3>
                  <p>Meet with our pastor or connect team to learn more</p>
                </div>
                <div className="next-step-card">
                  <div className="step-number">3</div>
                  <h3>Get Involved</h3>
                  <p>Explore our ministries and find your place to serve</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImNew;
