import React, { useState, useEffect } from 'react';
import './AdminGallery.css';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'sunday-service',
    date: '',
    description: '',
    imageFile: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    { id: 'sunday-service', name: 'Sunday Services' },
    { id: 'events', name: 'Church Events' },
    { id: 'youth', name: 'Youth Ministry' },
    { id: 'worship', name: 'Worship & Praise' },
    { id: 'community', name: 'Community Outreach' },
    { id: 'special', name: 'Special Occasions' }
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      // Ensure data is an array
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]); // Set empty array on error
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadStatus('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('Image must be less than 5MB');
      return;
    }

    setUploadForm(prev => ({ ...prev, imageFile: file }));
    setUploadStatus('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus('⏳ Uploading...');

    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('category', uploadForm.category);
    formData.append('date', uploadForm.date);
    formData.append('description', uploadForm.description);
    formData.append('image', uploadForm.imageFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setUploadStatus('Image uploaded successfully!');
        setUploadForm({
          title: '',
          category: 'sunday-service',
          date: '',
          description: '',
          imageFile: null
        });
        setImagePreview(null);
        fetchImages();
        setTimeout(() => setUploadStatus(''), 3000);
      } else {
        const error = await response.json();
        setUploadStatus(`Error: ${error.error || 'Upload failed'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Error uploading image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchImages();
      } else {
        alert('Error deleting image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting image');
    }
  };

  return (
    <div className="admin-gallery">
      <h2>📸 Photo Gallery Management</h2>
      <p className="section-description">
        Upload new photos or manage existing gallery images
      </p>

      {/* Upload Form */}
      <div className="upload-section">
        <h3>Upload New Photo</h3>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Photo Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={uploadForm.title}
                onChange={handleFormChange}
                required
                placeholder="e.g., Sunday Morning Worship"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={uploadForm.category}
                onChange={handleFormChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={uploadForm.date}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={uploadForm.description}
              onChange={handleFormChange}
              rows="3"
              placeholder="Optional description..."
            />
          </div>

          {/* Drag & Drop Zone */}
          <div
            className={`file-drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setUploadForm(prev => ({ ...prev, imageFile: null }));
                  }}
                  className="remove-preview"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <div className="drop-icon">📤</div>
                <p>Drag & drop your image here, or click to browse</p>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="btn btn-secondary">
                  Choose File
                </label>
                <small>Max size: 5MB. Formats: JPG, PNG, WebP</small>
              </>
            )}
          </div>

          {uploadStatus && (
            <div className={`upload-status ${uploadStatus.includes('✅') ? 'success' : uploadStatus.includes('❌') ? 'error' : ''}`}>
              {uploadStatus}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-gold"
            disabled={loading || !uploadForm.imageFile}
          >
            {loading ? '⏳ Uploading...' : '📤 Upload Photo'}
          </button>
        </form>
      </div>

      {/* Existing Images */}
      <div className="existing-images">
        <h3>Existing Photos ({images.length})</h3>
        <div className="images-grid">
          {images.map(image => (
            <div key={image.id} className="image-card">
              <div className="image-wrapper">
                <img src={image.imageUrl} alt={image.title} />
              </div>
              <div className="image-details">
                <h4>{image.title}</h4>
                <p className="image-date">{new Date(image.date).toLocaleDateString()}</p>
                <p className="image-category">{categories.find(c => c.id === image.category)?.name}</p>
                <button
                  onClick={() => handleDelete(image.id, image.imageUrl)}
                  className="btn btn-danger btn-small"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;

