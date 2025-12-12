import React from 'react';
import './LocationTimes.css';

const LocationTimes = () => {
  return (
    <div className="location-times-page">
      <section className="location-hero">
        <div className="container">
          <h1>Location & Times</h1>
          <p className="hero-text">
            We can't wait to see you! Here's everything you need to know to find us.
          </p>
        </div>
      </section>

      {/* Church Building Image */}
      <section className="section church-building-section">
        <div className="container">
          <div className="church-building-image">
            {/* Placeholder SVG for church building */}
            <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
              <rect width="800" height="500" fill="#e5e7eb"/>
              {/* Church Building */}
              <rect x="250" y="200" width="300" height="250" fill="#8B7355"/>
              {/* Roof */}
              <polygon points="250,200 400,100 550,200" fill="#5D4E37"/>
              {/* Cross */}
              <rect x="390" y="60" width="20" height="60" fill="#fff"/>
              <rect x="375" y="90" width="50" height="20" fill="#fff"/>
              {/* Windows */}
              <rect x="290" y="250" width="60" height="80" fill="#87CEEB"/>
              <rect x="370" y="250" width="60" height="80" fill="#87CEEB"/>
              <rect x="450" y="250" width="60" height="80" fill="#87CEEB"/>
              {/* Door */}
              <rect x="350" y="350" width="100" height="100" fill="#654321"/>
              <circle cx="420" cy="400" r="5" fill="#FFD700"/>
              {/* Ground */}
              <rect x="0" y="450" width="800" height="50" fill="#90EE90"/>
              {/* Sky details */}
              <circle cx="100" cy="100" r="40" fill="#fff" opacity="0.7"/>
              <circle cx="700" cy="120" r="35" fill="#fff" opacity="0.7"/>
            </svg>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="location-content">
            <div className="location-main">
              <div className="map-container">
                <div className="placeholder-map">
                  <span>Google Maps Embed</span>
                  <p>7003 28th Ave, Hudsonville, MI 49426</p>
                  <div style={{ marginTop: '1rem' }}>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=7003+28th+Ave+Hudsonville+MI+49426" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>

              <div className="address-card">
                <h2>Our Address</h2>
                <div className="address-info">
                  <div className="address-icon">📍</div>
                  <div>
                    <p className="address-text">
                      <strong>PIWC Grand Rapids</strong><br />
                      The Church of Pentecost<br />
                      7003 28th Ave<br />
                      Hudsonville, MI 49426
                    </p>
                    <div className="address-buttons">
                      <a 
                        href="https://www.google.com/maps/dir/?api=1&destination=7003+28th+Ave+Hudsonville+MI+49426" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="times-sidebar">
              <div className="times-card">
                <h2>Service Times</h2>
                <div className="service-time-item">
                  <div className="day-badge">Sunday</div>
                  <div className="time-info">
                    <h3>Worship Service</h3>
                    <p className="time">12:30 PM</p>
                    <p className="duration">Approximately 2 hours</p>
                  </div>
                </div>
              </div>

              <div className="parking-card">
                <div className="parking-icon">🅿️</div>
                <h3>Parking Information</h3>
                <ul>
                  <li>Free parking available on-site</li>
                  <li>Parking attendants to assist you</li>
                  <li>Accessible parking near entrance</li>
                  <li>Arrive 10-15 minutes early for best spots</li>
                </ul>
              </div>

              <div className="accessibility-card">
                <div className="accessibility-icon">♿</div>
                <h3>Accessibility</h3>
                <ul>
                  <li>Wheelchair accessible entrance</li>
                  <li>Accessible restrooms</li>
                  <li>Elevator available</li>
                  <li>Assisted listening devices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section directions-section">
        <div className="container">
          <h2 className="section-title">Driving Directions</h2>
          <div className="directions-grid">
            <div className="direction-card">
              <h3>From Downtown Grand Rapids</h3>
              <ol>
                <li>Head south on Division Ave S</li>
                <li>Turn left onto 44th St SE</li>
                <li>Church will be on your right</li>
              </ol>
              <p className="direction-time">⏱️ Approximately 15 minutes</p>
            </div>

            <div className="direction-card">
              <h3>From US-131</h3>
              <ol>
                <li>Take Exit 76 for 44th St</li>
                <li>Head east on 44th St SE</li>
                <li>Church will be on your left</li>
              </ol>
              <p className="direction-time">⏱️ Approximately 5 minutes</p>
            </div>

            <div className="direction-card">
              <h3>From M-6</h3>
              <ol>
                <li>Exit onto Kalamazoo Ave SE</li>
                <li>Turn left onto 44th St SE</li>
                <li>Church will be on your right</li>
              </ol>
              <p className="direction-time">⏱️ Approximately 10 minutes</p>
            </div>

            <div className="direction-card">
              <h3>From East Grand Rapids</h3>
              <ol>
                <li>Head south on Cascade Rd SE</li>
                <li>Turn right onto 44th St SE</li>
                <li>Church will be on your left</li>
              </ol>
              <p className="direction-time">⏱️ Approximately 20 minutes</p>
            </div>

            <div className="direction-card">
              <h3>From Kalamazoo, MI</h3>
              <ol>
                <li>Take US-131 North toward Grand Rapids</li>
                <li>Continue on US-131 North for approximately 50 miles</li>
                <li>Take Exit 76 for 28th Ave in Hudsonville</li>
                <li>Turn right onto 28th Ave</li>
                <li>Church will be on your right</li>
              </ol>
              <p className="direction-time">⏱️ Approximately 55-60 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section arrival-section">
        <div className="container">
          <h2 className="section-title">What to Expect When You Arrive</h2>
          <div className="arrival-timeline">
            <div className="timeline-item">
              <div className="timeline-number">1</div>
              <div className="timeline-content">
                <h3>Parking</h3>
                <p>
                  Our parking team will greet you and help you find a spot. Free parking 
                  is available throughout our lot.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">2</div>
              <div className="timeline-content">
                <h3>Welcome Center</h3>
                <p>
                  Stop by our Welcome Center in the lobby. Our greeters will answer questions 
                  and give you information about our church.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">3</div>
              <div className="timeline-content">
                <h3>Find a Seat</h3>
                <p>
                  Our ushers will help you find a seat. Feel free to sit anywhere you're 
                  comfortable - we don't have assigned seating!
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">4</div>
              <div className="timeline-content">
                <h3>Enjoy the Service</h3>
                <p>
                  Relax and enjoy worship, teaching, and fellowship. If you need anything 
                  during the service, just let an usher know.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Still Have Questions?</h2>
            <p>
              We're here to help! Contact us or check out our "I'm New" page for more 
              information about visiting PIWC Grand Rapids.
            </p>
            <div className="cta-buttons">
              <a href="/im-new" className="btn btn-primary">I'm New</a>
              <a href="/contact" className="btn btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationTimes;

