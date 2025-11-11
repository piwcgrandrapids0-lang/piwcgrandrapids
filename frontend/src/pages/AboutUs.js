import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
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
            </div>
            <div className="about-image">
              <div className="placeholder-image">
                <span>Church Community Photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🙏</div>
              <h3>Worship</h3>
              <p>
                We are passionate about worshiping God with all our hearts, minds, and strength. 
                Our worship is Spirit-filled, biblical, and centered on Jesus Christ.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">📖</div>
              <h3>Biblical Truth</h3>
              <p>
                We believe the Bible is God's inspired Word and the final authority for faith 
                and practice. We are committed to teaching and living out biblical truth.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Community</h3>
              <p>
                We are family. We believe in doing life together, supporting one another, 
                and creating a welcoming environment where everyone belongs.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Mission</h3>
              <p>
                We are called to share the Gospel locally and globally. We are committed to 
                evangelism, missions, and making disciples of all nations.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤲</div>
              <h3>Service</h3>
              <p>
                Following Jesus' example, we serve others with humility and love. We are 
                committed to meeting practical needs in our community.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔥</div>
              <h3>Spirit-Empowered</h3>
              <p>
                We believe in the power and gifts of the Holy Spirit. We depend on the Spirit 
                to guide, empower, and transform us.
              </p>
            </div>
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

