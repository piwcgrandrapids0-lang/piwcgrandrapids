import React, { useState, useEffect } from 'react';
import './UnderConstructionModal.css';

const UnderConstructionModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the modal before
    const hasSeenModal = localStorage.getItem('hasSeenConstructionModal');
    
    if (!hasSeenModal) {
      // Show modal after a brief delay for better UX
      setTimeout(() => {
        setIsVisible(true);
      }, 500);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Remember that user has seen the modal
    localStorage.setItem('hasSeenConstructionModal', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="construction-modal-overlay" onClick={handleClose}>
      <div className="construction-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="construction-modal-header">
          <h2>🚧 Website Under Construction</h2>
          <button 
            className="construction-modal-close" 
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="construction-modal-body">
          <div className="construction-icon">🏗️</div>
          
          <p className="construction-message">
            Welcome to <strong>PIWC Grand Rapids</strong>!
          </p>
          
          <p className="construction-details">
            Our website is currently <strong>in progress</strong>. Some content, including images, 
            may be AI-generated placeholders as we continue to update and finalize everything.
          </p>
          
          <div className="construction-timeline">
            <p className="timeline-text">
              <strong>Expected completion:</strong> Within the next 2 weeks
            </p>
          </div>
          
          <p className="construction-thanks">
            Thank you for your patience and attention! 🙏
          </p>
        </div>
        
        <div className="construction-modal-footer">
          <button 
            className="construction-modal-button" 
            onClick={handleClose}
          >
            Continue to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionModal;


