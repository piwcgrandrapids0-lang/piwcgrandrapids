import React from 'react';
import './Ministries.css';

const Ministries = () => {
  const ministries = [
    {
      id: 1,
      name: 'PIWC Kids',
      icon: '👶',
      description: 'A fun, safe, and engaging environment where children learn about Jesus through age-appropriate lessons, games, and activities.',
      ageGroup: 'Ages 0-12',
      meeting: 'Sundays during service',
      leader: 'Sister Abigail Frimpong',
      highlights: [
        'Nursery (0-2 years)',
        'Preschool (3-5 years)',
        'Elementary (6-12 years)',
        'Bible stories and worship',
        'Games and crafts',
        'Safe, loving environment'
      ]
    },
    {
      id: 2,
      name: 'Youth Ministry',
      icon: '🎸',
      description: 'Empowering the next generation to live out their faith boldly through worship, discipleship, and community.',
      ageGroup: 'Ages 13-18',
      meeting: 'Sundays & Youth Nights',
      leader: 'Brother Emmanuel Addo',
      highlights: [
        'Weekly youth services',
        'Bible studies',
        'Youth events and outings',
        'Leadership development',
        'Community service',
        'Mentorship programs'
      ]
    },
    {
      id: 3,
      name: "Men's Ministry",
      icon: '👨',
      description: 'Building strong, godly men through fellowship, accountability, and spiritual growth.',
      ageGroup: 'Adult Men',
      meeting: 'Monthly meetings',
      leader: 'Elder Samuel Boateng',
      highlights: [
        'Brotherhood and fellowship',
        'Bible study and prayer',
        'Accountability groups',
        'Leadership training',
        'Service projects',
        'Annual men\'s retreat'
      ]
    },
    {
      id: 4,
      name: "Women's Ministry",
      icon: '👩',
      description: 'Connecting women in faith, friendship, and spiritual growth through fellowship and service.',
      ageGroup: 'Adult Women',
      meeting: 'Monthly meetings',
      leader: 'Mrs. Grace Mensah',
      highlights: [
        'Women\'s fellowship',
        'Bible studies',
        'Prayer meetings',
        'Mentorship programs',
        'Community outreach',
        'Women\'s conference'
      ]
    },
    {
      id: 5,
      name: 'Worship Team',
      icon: '🎵',
      description: 'Leading the congregation in Spirit-filled worship through music and song.',
      ageGroup: 'All ages',
      meeting: 'Weekly rehearsals',
      leader: 'Worship Director',
      highlights: [
        'Choir ministry',
        'Instrumentalists',
        'Praise and worship',
        'Special music',
        'Training opportunities',
        'Auditions open'
      ]
    },
    {
      id: 6,
      name: 'Ushering Ministry',
      icon: '🤝',
      description: 'Serving as the first point of contact, welcoming and assisting guests and members.',
      ageGroup: 'All ages',
      meeting: 'Sundays',
      leader: 'Head Usher',
      highlights: [
        'Guest reception',
        'Seating assistance',
        'Offering collection',
        'Information services',
        'Safety and security',
        'Hospitality training'
      ]
    },
    {
      id: 7,
      name: 'Intercessory Prayer',
      icon: '🙏',
      description: 'Standing in the gap through fervent prayer for the church, community, and world.',
      ageGroup: 'All ages',
      meeting: 'Weekly prayer meetings',
      leader: 'Prayer Coordinator',
      highlights: [
        'Corporate prayer',
        'Prayer chains',
        'Fasting and prayer',
        'Prayer requests',
        'Early morning prayers',
        'Special prayer events'
      ]
    },
    {
      id: 8,
      name: 'Outreach & Missions',
      icon: '🌍',
      description: 'Sharing the Gospel and serving our community through evangelism and compassionate action.',
      ageGroup: 'All ages',
      meeting: 'Monthly outreach',
      leader: 'Missions Team',
      highlights: [
        'Community evangelism',
        'Food pantry support',
        'Hospital visits',
        'Prison ministry',
        'Global missions support',
        'Short-term mission trips'
      ]
    }
  ];

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
            <p>
              At PIWC Grand Rapids, we believe that every member is called to serve. God has 
              uniquely gifted you to make a difference in His kingdom. Whether you're passionate 
              about working with children, leading worship, serving the community, or praying for 
              others, there's a place for you to use your gifts and talents.
            </p>
            <p>
              Browse our ministries below and find where you can plug in and make an impact!
            </p>
          </div>
        </div>
      </section>

      <section className="section ministries-section">
        <div className="container">
          {ministries.map((ministry, index) => (
            <div key={ministry.id} className={`ministry-detailed ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="ministry-info">
                <div className="ministry-header">
                  <div className="ministry-icon-large">{ministry.icon}</div>
                  <div>
                    <h2>{ministry.name}</h2>
                    <div className="ministry-meta">
                      <span><strong>Age Group:</strong> {ministry.ageGroup}</span>
                      <span><strong>Meeting:</strong> {ministry.meeting}</span>
                      <span><strong>Leader:</strong> {ministry.leader}</span>
                    </div>
                  </div>
                </div>
                <p className="ministry-description">{ministry.description}</p>
                <div className="ministry-highlights">
                  <h3>What We Do:</h3>
                  <ul>
                    {ministry.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="ministry-image">
                <div className="placeholder-ministry-image">
                  <span>{ministry.name} Photo</span>
                </div>
              </div>
            </div>
          ))}
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

