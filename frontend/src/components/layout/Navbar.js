import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import axios from '../../config/axios';
import './Navbar.css';
import defaultLogo from '../../assets/images/church-logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [branding, setBranding] = useState({
    logoUrl: defaultLogo,
    churchName: 'PIWC'
  });
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const response = await axios.get('/api/content');
        if (response.data.branding) {
          setBranding(response.data.branding);
        }
      } catch (error) {
        console.error('Error fetching branding:', error);
      }
    };
    fetchBranding();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <div className="logo-content">
            <div className="logo-image-container">
              <img 
                src={branding.logoUrl || defaultLogo} 
                alt={`${branding.churchName || 'PIWC'} Grand Rapids Logo`} 
                className="logo-image"
                onError={(e) => {
                  // If image fails to load, try defaultLogo
                  if (e.target.src !== defaultLogo) {
                    e.target.src = defaultLogo;
                  } else {
                    // If even defaultLogo fails, hide and show placeholder
                    e.target.style.display = 'none';
                    e.target.nextSibling?.classList.add('show-placeholder');
                  }
                }}
              />
              <div className="logo-placeholder" style={{ display: 'none' }}>⛪</div>
            </div>
            <div className="logo-text-container">
              <span className="logo-text">{branding.churchName || 'PIWC'}</span>
              <span className="logo-subtext">Grand Rapids</span>
            </div>
          </div>
        </Link>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/im-new" className="navbar-link navbar-link-highlight">I'm New</Link>
          
          <div 
            className="navbar-dropdown"
            onMouseEnter={() => setIsAboutDropdownOpen(true)}
            onMouseLeave={() => setIsAboutDropdownOpen(false)}
          >
            <span className="navbar-link">
              About
              <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </span>
            <div className={`dropdown-menu ${isAboutDropdownOpen ? 'active' : ''}`}>
              <Link to="/about" className="dropdown-link">About Us</Link>
              <Link to="/beliefs" className="dropdown-link">Our Beliefs</Link>
              <Link to="/mission-vision" className="dropdown-link">Mission & Vision</Link>
            </div>
          </div>

          <Link to="/leadership" className="navbar-link">Leadership</Link>
          <Link to="/ministries" className="navbar-link">Ministries</Link>
          <Link to="/watch" className="navbar-link">Watch</Link>
          <Link to="/gallery" className="navbar-link">Gallery</Link>
          <Link to="/events" className="navbar-link">Events</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>
          
          {isAuthenticated && (
            <Link to="/admin" className="navbar-link">Admin</Link>
          )}
          
          <a 
            href="https://tithe.ly/give/?c=1373113&k=1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary navbar-btn"
          >
            Give
          </a>
          
          <button
            className="theme-toggle-navbar"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2"/>
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
          </button>
          
          {isAuthenticated && location.pathname !== '/admin' && (
            <button onClick={logout} className="btn btn-secondary navbar-btn">
              Logout
            </button>
          )}
        </div>

        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

