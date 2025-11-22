import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { id: 'all', name: 'All Photos', icon: '📸' },
    { id: 'sunday-service', name: 'Sunday Services', icon: '⛪' },
    { id: 'events', name: 'Church Events', icon: '🎉' },
    { id: 'youth', name: 'Youth Ministry', icon: '👥' },
    { id: 'worship', name: 'Worship & Praise', icon: '🎵' },
    { id: 'community', name: 'Community Outreach', icon: '🤝' },
    { id: 'special', name: 'Special Occasions', icon: '✨' }
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory, images]);

  const fetchImages = async () => {
    try {
      const response = await axios.get('/api/gallery');
      const data = response.data;
      setImages(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setFilteredImages(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };


  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="container">
          <h1>Photo Gallery</h1>
          <p className="hero-text">
            Capturing moments of worship, fellowship, and community. See what God is doing in our midst!
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Filter */}
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading images...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="empty-gallery">
              <div className="empty-icon">📷</div>
              <h3>No Photos Yet</h3>
              <p>
                {selectedCategory === 'all' 
                  ? 'Check back soon for photos from our services and events!'
                  : `No photos in this category yet.`
                }
              </p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredImages.map(image => (
                <div 
                  key={image.id} 
                  className="gallery-item"
                  onClick={() => openImageModal(image)}
                >
                  <div className="gallery-image-wrapper">
                    <img src={image.imageUrl} alt={image.title} />
                    <div className="gallery-overlay">
                      <h4>{image.title}</h4>
                      <p>{new Date(image.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeImageModal}>×</button>
            <div className="image-detail">
              <img src={selectedImage.imageUrl} alt={selectedImage.title} />
              <div className="image-info">
                <h2>{selectedImage.title}</h2>
                <p className="image-date">
                  📅 {new Date(selectedImage.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="image-category">
                  {categories.find(cat => cat.id === selectedImage.category)?.icon}{' '}
                  {categories.find(cat => cat.id === selectedImage.category)?.name}
                </p>
                {selectedImage.description && (
                  <p className="image-description">{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

