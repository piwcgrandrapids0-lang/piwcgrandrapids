import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import './AdminContent.css';

const AdminContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeSection, setActiveSection] = useState('hero');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/api/content');
      setContent(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section, parent, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value
        }
      }
    }));
  };

  const handleArrayItemChange = (section, arrayName, index, field, value) => {
    setContent(prev => {
      const newArray = [...prev[section][arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: newArray
        }
      };
    });
  };

  const handleDeepNestedChange = (section, parent, subParent, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [subParent]: {
            ...prev[section][parent][subParent],
            [field]: value
          }
        }
      }
    }));
  };

  const handleAddArrayItem = (section, arrayName, newItem) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayName]: [...(prev[section][arrayName] || []), newItem]
      }
    }));
  };

  const handleDeleteArrayItem = (section, arrayName, index) => {
    setContent(prev => {
      const newArray = [...prev[section][arrayName]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: newArray
        }
      };
    });
  };

  // Helper for nested array changes (e.g., imNew.whatToExpect.steps)
  const handleNestedArrayItemChange = (section, parent, arrayName, index, field, value) => {
    setContent(prev => {
      const newArray = [...prev[section][parent][arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [parent]: {
            ...prev[section][parent],
            [arrayName]: newArray
          }
        }
      };
    });
  };

  // Helper for adding items to nested arrays
  const handleAddNestedArrayItem = (section, parent, arrayName, newItem) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [arrayName]: [...(prev[section][parent][arrayName] || []), newItem]
        }
      }
    }));
  };

  // Helper for deleting items from nested arrays
  const handleDeleteNestedArrayItem = (section, parent, arrayName, index) => {
    setContent(prev => {
      const newArray = [...prev[section][parent][arrayName]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [parent]: {
            ...prev[section][parent],
            [arrayName]: newArray
          }
        }
      };
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return null;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('uploadType', 'images'); // Always use 'images' directory
    
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        alert(`Image uploaded successfully!`);
        return response.data.url;
      } else {
        alert(`Upload failed: ${response.data.error}`);
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (section) => {
    setSaving(true);
    setSaveStatus('⏳ Saving...');

    try {
      await axios.put(`/api/content/${section}`, content[section]);
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'branding', name: 'Logo & Branding', icon: '🎨' },
    { id: 'hero', name: 'Homepage Hero', icon: '🏠' },
    { id: 'welcomeHome', name: 'Welcome Home', icon: '🏡' },
    { id: 'whatToExpect', name: 'What to Expect', icon: '📋' },
    { id: 'latestMessage', name: 'Latest Message', icon: '🎬' },
    { id: 'services', name: 'Service Times', icon: '⏰' },
    { id: 'contact', name: 'Contact Info', icon: '📞' },
    { id: 'about', name: 'About Us', icon: 'ℹ️' },
    { id: 'beliefs', name: 'Our Beliefs', icon: '✝️' },
    { id: 'missionVision', name: 'Mission & Vision', icon: '🎯' },
    { id: 'leadership', name: 'Leadership Team', icon: '👥' },
    { id: 'ministries', name: 'Ministries', icon: '⛪' },
    { id: 'give', name: 'Give', icon: '💰' },
    { id: 'imNew', name: "I'm New", icon: '👋' },
    { id: 'footer', name: 'Footer', icon: '📄' }
  ];

  if (loading) {
    return <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading content...</p>
    </div>;
  }

  if (!content) {
    return <div className="error-message">Failed to load content</div>;
  }

  return (
    <div className="admin-content-manager">
      <h2>📝 Website Content Management</h2>
      <p className="section-description">
        Update website content directly from the admin panel
      </p>

      <div className="content-sections">
        <div className="section-nav">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`section-nav-button ${activeSection === section.id ? 'active' : ''}`}
            >
              <span className="section-icon">{section.icon}</span>
              <span>{section.name}</span>
            </button>
          ))}
        </div>

        <div className="section-editor">
          {/* Branding Section */}
          {activeSection === 'branding' && content.branding && (
            <div className="editor-panel">
              <h3>🎨 Logo & Branding</h3>
              <p className="section-note">
                Update your church logo and branding information. The logo appears in the navigation bar.
              </p>
              
              <div className="form-group">
                <label>Church Name (Short)</label>
                <input
                  type="text"
                  value={content.branding.churchName}
                  onChange={(e) => handleChange('branding', 'churchName', e.target.value)}
                  placeholder="PIWC Grand Rapids"
                />
                <small>Appears next to the logo in the navbar</small>
              </div>

              <div className="form-group">
                <label>Full Church Name</label>
                <input
                  type="text"
                  value={content.branding.fullName}
                  onChange={(e) => handleChange('branding', 'fullName', e.target.value)}
                  placeholder="The Church of Pentecost USA, Inc. - PIWC Grand Rapids (Detroit District)"
                />
                <small>Used in official documents and page titles</small>
              </div>

              <div className="form-group">
                <label>Tagline</label>
                <input
                  type="text"
                  value={content.branding.tagline}
                  onChange={(e) => handleChange('branding', 'tagline', e.target.value)}
                  placeholder="Where Faith Meets Fellowship"
                />
                <small>Your church's motto or slogan</small>
              </div>

              <div className="form-group">
                <label>Church Logo</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={content.branding.logoUrl}
                      onChange={(e) => handleChange('branding', 'logoUrl', e.target.value)}
                      placeholder="/uploads/images/church-logo.png"
                    />
                    <small>Logo URL (auto-filled after upload)</small>
                  </div>
                  <div>
                    <label 
                      htmlFor="logoUpload" 
                      className="btn btn-secondary" 
                      style={{ cursor: 'pointer', margin: 0 }}
                    >
                      {uploading ? '⏳ Uploading...' : '📤 Upload Logo'}
                    </label>
                    <input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            handleChange('branding', 'logoUrl', url);
                          }
                        }
                      }}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              {content.branding.logoUrl && (
                <div className="logo-preview">
                  <h4>Logo Preview:</h4>
                  <div className="preview-container">
                    <img 
                      src={content.branding.logoUrl} 
                      alt="Church Logo Preview" 
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="40">⛪</text></svg>';
                      }}
                    />
                  </div>
                  <small className="preview-note">
                    ✨ Logo uploaded successfully! Click "Save Changes" to apply.
                  </small>
                </div>
              )}

              <button
                onClick={() => handleSave('branding')}
                className="btn btn-gold"
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="editor-panel">
              <h3>🏠 Homepage Hero Section</h3>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => handleChange('hero', 'title', e.target.value)}
                  placeholder="Main title"
                />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={content.hero.subtitle}
                  onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                  placeholder="Subtitle"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.hero.description}
                  onChange={(e) => handleChange('hero', 'description', e.target.value)}
                  rows="4"
                  placeholder="Hero description"
                />
              </div>
              <button
                onClick={() => handleSave('hero')}
                className="btn btn-gold"
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Welcome Home Section */}
          {activeSection === 'welcomeHome' && content.welcomeHome && (
            <div className="editor-panel">
              <h3>🏡 Welcome Home Section</h3>
              <p className="section-note">
                Edit the "Welcome Home" section on the homepage
              </p>
              
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={content.welcomeHome.title}
                  onChange={(e) => handleChange('welcomeHome', 'title', e.target.value)}
                  placeholder="Welcome Home"
                />
              </div>

              <div className="form-group">
                <label>Paragraph 1</label>
                <textarea
                  value={content.welcomeHome.paragraph1}
                  onChange={(e) => handleChange('welcomeHome', 'paragraph1', e.target.value)}
                  rows="3"
                  placeholder="First paragraph..."
                />
              </div>

              <div className="form-group">
                <label>Paragraph 2</label>
                <textarea
                  value={content.welcomeHome.paragraph2}
                  onChange={(e) => handleChange('welcomeHome', 'paragraph2', e.target.value)}
                  rows="3"
                  placeholder="Second paragraph..."
                />
              </div>

              <div className="form-group">
                <label>Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={content.welcomeHome.imageUrl}
                      onChange={(e) => handleChange('welcomeHome', 'imageUrl', e.target.value)}
                      placeholder="/uploads/images/church-building.jpg"
                    />
                    <small>Image URL (auto-filled after upload)</small>
                  </div>
                  <div>
                    <label 
                      htmlFor="welcomeImage" 
                      className="btn btn-secondary" 
                      style={{ cursor: 'pointer', margin: 0 }}
                    >
                      {uploading ? '⏳ Uploading...' : '📤 Upload Image'}
                    </label>
                    <input
                      id="welcomeImage"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            handleChange('welcomeHome', 'imageUrl', url);
                          }
                        }
                      }}
                      disabled={uploading}
                    />
                  </div>
                </div>
                {content.welcomeHome.imageUrl && (
                  <div style={{ marginTop: '1rem' }}>
                    <img 
                      src={content.welcomeHome.imageUrl} 
                      alt="Preview" 
                      style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    value={content.welcomeHome.buttonText}
                    onChange={(e) => handleChange('welcomeHome', 'buttonText', e.target.value)}
                    placeholder="Learn More About Us"
                  />
                </div>
                <div className="form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    value={content.welcomeHome.buttonLink}
                    onChange={(e) => handleChange('welcomeHome', 'buttonLink', e.target.value)}
                    placeholder="/about"
                  />
                </div>
              </div>

              <button onClick={() => handleSave('welcomeHome')} className="btn btn-gold" disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* What to Expect Section */}
          {activeSection === 'whatToExpect' && content.whatToExpect && (
            <div className="editor-panel">
              <h3>📋 What to Expect Section</h3>
              <p className="section-note">
                Edit the "What to Expect" section on the homepage
              </p>
              
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={content.whatToExpect.title}
                  onChange={(e) => handleChange('whatToExpect', 'title', e.target.value)}
                  placeholder="What to Expect"
                />
              </div>

              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={content.whatToExpect.subtitle}
                  onChange={(e) => handleChange('whatToExpect', 'subtitle', e.target.value)}
                  placeholder="First time visiting? Here's what a typical Sunday looks like"
                />
              </div>

              <h4>Steps</h4>
              {content.whatToExpect.steps && content.whatToExpect.steps.map((step, index) => (
                <div key={index} className="array-item">
                  <h5>Step {step.number}</h5>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleArrayItemChange('whatToExpect', 'steps', index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={step.description}
                      onChange={(e) => handleArrayItemChange('whatToExpect', 'steps', index, 'description', e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              ))}

              <button onClick={() => handleSave('whatToExpect')} className="btn btn-gold" disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Latest Message Section */}
          {activeSection === 'latestMessage' && content.latestMessage && (
            <div className="editor-panel">
              <h3>🎬 Latest Message Section</h3>
              <p className="section-note">
                Edit the featured sermon displayed on the homepage
              </p>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={content.latestMessage.enabled}
                    onChange={(e) => handleChange('latestMessage', 'enabled', e.target.checked)}
                  />
                  {' '}Enable Latest Message Section
                </label>
              </div>

              <div className="form-group">
                <label>Section Title</label>
                <input
                  type="text"
                  value={content.latestMessage.title}
                  onChange={(e) => handleChange('latestMessage', 'title', e.target.value)}
                  placeholder="Latest Message"
                />
              </div>

              <div className="form-group">
                <label>Section Subtitle</label>
                <input
                  type="text"
                  value={content.latestMessage.subtitle}
                  onChange={(e) => handleChange('latestMessage', 'subtitle', e.target.value)}
                  placeholder="Latest Sermon Video"
                />
              </div>

              <h4>Sermon Details</h4>
              <div className="form-group">
                <label>Sermon Title</label>
                <input
                  type="text"
                  value={content.latestMessage.sermon.title}
                  onChange={(e) => handleNestedChange('latestMessage', 'sermon', 'title', e.target.value)}
                  placeholder="Walking in Faith and Purpose"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Speaker</label>
                  <input
                    type="text"
                    value={content.latestMessage.sermon.speaker}
                    onChange={(e) => handleNestedChange('latestMessage', 'sermon', 'speaker', e.target.value)}
                    placeholder="Pastor John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="text"
                    value={content.latestMessage.sermon.date}
                    onChange={(e) => handleNestedChange('latestMessage', 'sermon', 'date', e.target.value)}
                    placeholder="November 10, 2025"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={content.latestMessage.sermon.category}
                  onChange={(e) => handleNestedChange('latestMessage', 'sermon', 'category', e.target.value)}
                  placeholder="Sunday Service"
                />
              </div>

              <div className="form-group">
                <label>YouTube Video URL</label>
                <input
                  type="url"
                  value={content.latestMessage.sermon.videoUrl}
                  onChange={(e) => handleNestedChange('latestMessage', 'sermon', 'videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <small>Paste YouTube URL - will be auto-converted to embed format</small>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.latestMessage.sermon.description}
                  onChange={(e) => handleNestedChange('latestMessage', 'sermon', 'description', e.target.value)}
                  rows="4"
                  placeholder="Brief description..."
                />
              </div>

              <button onClick={() => handleSave('latestMessage')} className="btn btn-gold" disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Services Section */}
          {activeSection === 'services' && (
            <div className="editor-panel">
              <h3>⏰ Service Times</h3>
              <div className="service-group">
                <h4>Sunday Service</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="text"
                      value={content.services.sunday.time}
                      onChange={(e) => handleNestedChange('services', 'sunday', 'time', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <input
                      type="text"
                      value={content.services.sunday.type}
                      onChange={(e) => handleNestedChange('services', 'sunday', 'type', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={content.services.sunday.description}
                    onChange={(e) => handleNestedChange('services', 'sunday', 'description', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>

              <div className="service-group">
                <h4>Friday Prayer Meeting</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="text"
                      value={content.services.friday.time}
                      onChange={(e) => handleNestedChange('services', 'friday', 'time', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <input
                      type="text"
                      value={content.services.friday.type}
                      onChange={(e) => handleNestedChange('services', 'friday', 'type', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={content.services.friday.description}
                    onChange={(e) => handleNestedChange('services', 'friday', 'description', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSave('services')}
                className="btn btn-gold"
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="editor-panel">
              <h3>📞 Contact Information</h3>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={content.contact.phone}
                  onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => handleChange('contact', 'email', e.target.value)}
                />
              </div>
              <h4>Address</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Street</label>
                  <input
                    type="text"
                    value={content.contact.address.street}
                    onChange={(e) => handleNestedChange('contact', 'address', 'street', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={content.contact.address.city}
                    onChange={(e) => handleNestedChange('contact', 'address', 'city', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={content.contact.address.state}
                    onChange={(e) => handleNestedChange('contact', 'address', 'state', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    value={content.contact.address.zip}
                    onChange={(e) => handleNestedChange('contact', 'address', 'zip', e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => handleSave('contact')}
                className="btn btn-gold"
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* About Section */}
          {activeSection === 'about' && (
            <div className="editor-panel">
              <h3>ℹ️ About Us</h3>
              <div className="form-group">
                <label>Mission Statement</label>
                <textarea
                  value={content.about.mission || ''}
                  onChange={(e) => handleChange('about', 'mission', e.target.value)}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Vision Statement</label>
                <textarea
                  value={content.about.vision || ''}
                  onChange={(e) => handleChange('about', 'vision', e.target.value)}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>About Description</label>
                <textarea
                  value={content.about.description || ''}
                  onChange={(e) => handleChange('about', 'description', e.target.value)}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <input
                      type="text"
                      value={content.about.imageUrl || ''}
                      onChange={(e) => handleChange('about', 'imageUrl', e.target.value)}
                      placeholder="/uploads/images/church-community.jpg"
                    />
                    <small>Image URL (auto-filled after upload)</small>
                  </div>
                  <div>
                    <label 
                      htmlFor="aboutImage" 
                      className="btn btn-secondary" 
                      style={{ cursor: 'pointer', margin: 0 }}
                    >
                      {uploading ? '⏳ Uploading...' : '📤 Upload Image'}
                    </label>
                    <input
                      id="aboutImage"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            handleChange('about', 'imageUrl', url);
                          }
                        }
                      }}
                      disabled={uploading}
                    />
                  </div>
                </div>
                {content.about.imageUrl && (
                  <div style={{ marginTop: '1rem' }}>
                    <img 
                      src={content.about.imageUrl} 
                      alt="About Us Preview" 
                      style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => handleSave('about')}
                className="btn btn-gold"
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Beliefs Section */}
          {activeSection === 'beliefs' && content.beliefs && (
            <div className="editor-panel">
              <h3>✝️ Our Beliefs</h3>
              <div className="form-group">
                <label>Introduction</label>
                <textarea
                  value={content.beliefs.intro}
                  onChange={(e) => handleChange('beliefs', 'intro', e.target.value)}
                  rows="2"
                />
              </div>
              
              <h4>Core Beliefs</h4>
              {content.beliefs.coreBeliefs.map((belief, index) => (
                <div key={index} className="array-item">
                  <h5>Belief {index + 1}</h5>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={belief.title}
                      onChange={(e) => handleArrayItemChange('beliefs', 'coreBeliefs', index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={belief.description}
                      onChange={(e) => handleArrayItemChange('beliefs', 'coreBeliefs', index, 'description', e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>
              ))}
              <button onClick={() => handleSave('beliefs')} className="btn btn-gold" disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Mission & Vision Section */}
          {activeSection === 'missionVision' && content.missionVision && (
            <div className="editor-panel">
              <h3>🎯 Mission & Vision</h3>
              
              <div className="section-group">
                <h4>Mission</h4>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={content.missionVision.mission.title}
                    onChange={(e) => handleDeepNestedChange('missionVision', 'mission', 'title', '', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Statement</label>
                  <textarea
                    value={content.missionVision.mission.statement}
                    onChange={(e) => handleNestedChange('missionVision', 'mission', 'statement', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={content.missionVision.mission.description}
                    onChange={(e) => handleNestedChange('missionVision', 'mission', 'description', e.target.value)}
                    rows="3"
                  />
                </div>
              </div>

              <div className="section-group">
                <h4>Vision</h4>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={content.missionVision.vision.title}
                    onChange={(e) => handleNestedChange('missionVision', 'vision', 'title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Statement</label>
                  <textarea
                    value={content.missionVision.vision.statement}
                    onChange={(e) => handleNestedChange('missionVision', 'vision', 'statement', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={content.missionVision.vision.description}
                    onChange={(e) => handleNestedChange('missionVision', 'vision', 'description', e.target.value)}
                    rows="3"
                  />
                </div>
              </div>

              <div className="section-group" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid #e0e0e0' }}>
                <h4>Core Values</h4>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                  Add, edit, or remove core values. Each value has a title and description.
                </p>
                
                {(content.missionVision.values || []).map((value, index) => (
                  <div key={index} style={{ 
                    border: '1px solid #ddd', 
                    padding: '1rem', 
                    marginBottom: '1rem', 
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong>Value #{index + 1}</strong>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this core value?')) {
                            handleDeleteArrayItem('missionVision', 'values', index);
                          }
                        }}
                        className="btn btn-danger btn-small"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={value.title || ''}
                        onChange={(e) => handleArrayItemChange('missionVision', 'values', index, 'title', e.target.value)}
                        placeholder="EVANGELISM"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={value.description || ''}
                        onChange={(e) => handleArrayItemChange('missionVision', 'values', index, 'description', e.target.value)}
                        rows="6"
                        placeholder="Enter the full description of this core value..."
                        style={{ minHeight: '120px' }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    handleAddArrayItem('missionVision', 'values', {
                      title: '',
                      description: ''
                    });
                  }}
                  className="btn btn-primary btn-small"
                  style={{ marginTop: '0.5rem' }}
                >
                  ➕ Add Core Value
                </button>
              </div>
              
              <button onClick={() => handleSave('missionVision')} className="btn btn-gold" disabled={saving} style={{ marginTop: '1.5rem' }}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Leadership Section */}
          {activeSection === 'leadership' && content.leadership && (
            <div className="editor-panel">
              <h3>👥 Leadership Team</h3>
              <p className="section-note">
                Manage your church leadership team. Add/edit/delete leaders and upload photos.
              </p>
              
              <div className="form-group">
                <label>Introduction</label>
                <textarea
                  value={content.leadership.intro}
                  onChange={(e) => handleChange('leadership', 'intro', e.target.value)}
                  rows="2"
                  placeholder="Leadership team introduction..."
                />
              </div>

              <div className="form-group">
                <label>Team Description</label>
                <textarea
                  value={content.leadership.teamDescription}
                  onChange={(e) => handleChange('leadership', 'teamDescription', e.target.value)}
                  rows="3"
                  placeholder="Overall team description..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 1rem 0' }}>
                <h4 style={{ margin: 0 }}>Leadership Team Members</h4>
                <button
                  onClick={() => {
                    const newLeader = {
                      id: Date.now(),
                      name: 'New Leader',
                      title: 'Position Title',
                      bio: 'Leader biography...',
                      email: 'email@piwcgr.org',
                      photoUrl: '/assets/images/leaders/default.png',
                      isLeadPastor: false
                    };
                    handleAddArrayItem('leadership', 'leaders', newLeader);
                  }}
                  className="btn btn-primary btn-small"
                >
                  ➕ Add Leader
                </button>
              </div>

              {content.leadership.leaders && content.leadership.leaders.map((leader, index) => (
                <div key={leader.id} className="array-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h5 style={{ margin: 0 }}>
                      {leader.isLeadPastor ? '⭐ ' : ''}{leader.name}
                    </h5>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${leader.name}?`)) {
                          handleDeleteArrayItem('leadership', 'leaders', index);
                        }
                      }}
                      className="btn btn-danger btn-small"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Name *</label>
                      <input
                        type="text"
                        value={leader.name}
                        onChange={(e) => handleArrayItemChange('leadership', 'leaders', index, 'name', e.target.value)}
                        placeholder="Pastor John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={leader.isLeadPastor || false}
                          onChange={(e) => handleArrayItemChange('leadership', 'leaders', index, 'isLeadPastor', e.target.checked)}
                        />
                        {' '}Lead Pastor
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={leader.title}
                      onChange={(e) => handleArrayItemChange('leadership', 'leaders', index, 'title', e.target.value)}
                      placeholder="Lead Pastor"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio *</label>
                    <textarea
                      value={leader.bio}
                      onChange={(e) => handleArrayItemChange('leadership', 'leaders', index, 'bio', e.target.value)}
                      rows="4"
                      placeholder="Brief biography..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={leader.email}
                      onChange={(e) => handleArrayItemChange('leadership', 'leaders', index, 'email', e.target.value)}
                      placeholder="pastor@piwcgr.org"
                    />
                  </div>

                  <div className="form-group">
                    <label>Leader Photo</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          value={leader.photoUrl}
                          onChange={(e) => handleArrayItemChange('leadership', 'leaders', index, 'photoUrl', e.target.value)}
                          placeholder="/uploads/images/photo.jpg"
                        />
                        <small>Photo URL (auto-filled after upload)</small>
                      </div>
                      <div>
                        <label 
                          htmlFor={`leaderPhoto${index}`} 
                          className="btn btn-secondary" 
                          style={{ cursor: 'pointer', margin: 0 }}
                        >
                          {uploading ? '⏳' : '📤 Upload'}
                        </label>
                        <input
                          id={`leaderPhoto${index}`}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const url = await handleFileUpload(file);
                              if (url) {
                                handleArrayItemChange('leadership', 'leaders', index, 'photoUrl', url);
                              }
                            }
                          }}
                          disabled={uploading}
                        />
                      </div>
                    </div>
                    {leader.photoUrl && (
                      <div style={{ marginTop: '1rem' }}>
                        <img 
                          src={leader.photoUrl} 
                          alt={`${leader.name} preview`}
                          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button onClick={() => handleSave('leadership')} className="btn btn-gold" disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Ministries Section */}
          {activeSection === 'ministries' && content.ministries && (
            <div className="editor-panel">
              <h3>⛪ Ministries</h3>
              <div className="form-group">
                <label>Introduction</label>
                <textarea
                  value={content.ministries.intro}
                  onChange={(e) => handleChange('ministries', 'intro', e.target.value)}
                  rows="2"
                />
              </div>

              <h4>Ministry List</h4>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                Add, edit, or remove ministries. Each ministry has a name and description.
              </p>
              
              {(content.ministries.list || []).map((ministry, index) => (
                <div key={index} style={{ 
                  border: '1px solid #ddd', 
                  padding: '1rem', 
                  marginBottom: '1rem', 
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong>Ministry #{index + 1}</strong>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this ministry?')) {
                          handleDeleteArrayItem('ministries', 'list', index);
                        }
                      }}
                      className="btn btn-danger btn-small"
                      style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={ministry.name || ''}
                      onChange={(e) => handleArrayItemChange('ministries', 'list', index, 'name', e.target.value)}
                      placeholder="PIWC Kids"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={ministry.description || ''}
                      onChange={(e) => handleArrayItemChange('ministries', 'list', index, 'description', e.target.value)}
                      rows="4"
                      placeholder="Enter ministry description..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                      <input
                        type="text"
                        value={ministry.imageUrl || ''}
                        onChange={(e) => handleArrayItemChange('ministries', 'list', index, 'imageUrl', e.target.value)}
                        placeholder="/uploads/images/ministry-photo.jpg"
                        style={{ flex: 1 }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id={`ministry-image-${index}`}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              handleArrayItemChange('ministries', 'list', index, 'imageUrl', url);
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor={`ministry-image-${index}`}
                        className="btn btn-secondary btn-small"
                        style={{ 
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          marginBottom: 0
                        }}
                      >
                        {uploading ? '⏳ Uploading...' : '📤 Upload Image'}
                      </label>
                    </div>
                    <small>Upload an image or enter an image URL. Images are stored in Azure Blob Storage.</small>
                    {ministry.imageUrl && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <img 
                          src={ministry.imageUrl.startsWith('http') ? ministry.imageUrl : `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${ministry.imageUrl}`}
                          alt="Preview"
                          style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  handleAddArrayItem('ministries', 'list', {
                    name: '',
                    description: '',
                    imageUrl: ''
                  });
                }}
                className="btn btn-primary btn-small"
                style={{ marginTop: '0.5rem' }}
              >
                ➕ Add Ministry
              </button>
              
              <button onClick={() => handleSave('ministries')} className="btn btn-gold" disabled={saving} style={{ marginTop: '1.5rem' }}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Give Section */}
          {activeSection === 'give' && content.give && (
            <div className="editor-panel">
              <h3>💰 Give</h3>
              <div className="form-group">
                <label>Introduction</label>
                <textarea
                  value={content.give.intro}
                  onChange={(e) => handleChange('give', 'intro', e.target.value)}
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>Why Give? (Explanation)</label>
                <textarea
                  value={content.give.why}
                  onChange={(e) => handleChange('give', 'why', e.target.value)}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Impact Statement</label>
                <textarea
                  value={content.give.impact}
                  onChange={(e) => handleChange('give', 'impact', e.target.value)}
                  rows="2"
                />
              </div>

              <h4>How to Give</h4>
              {content.give.howToGive.map((method, index) => (
                <div key={index} className="array-item">
                  <h5>Method {index + 1}: {method.method}</h5>
                  <div className="form-group">
                    <label>Method Name</label>
                    <input
                      type="text"
                      value={method.method}
                      onChange={(e) => handleArrayItemChange('give', 'howToGive', index, 'method', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={method.description}
                      onChange={(e) => handleArrayItemChange('give', 'howToGive', index, 'description', e.target.value)}
                      rows="2"
                    />
                  </div>
                  {method.link && (
                    <div className="form-group">
                      <label>Link (if applicable)</label>
                      <input
                        type="url"
                        value={method.link}
                        onChange={(e) => handleArrayItemChange('give', 'howToGive', index, 'link', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => handleSave('give')} className="btn btn-gold" disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* I'm New Section */}
          {activeSection === 'imNew' && content.imNew && (
            <div className="editor-panel">
              <h3>👋 I'm New</h3>
              
              <h4>Welcome Message</h4>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={content.imNew.welcome.title}
                  onChange={(e) => handleNestedChange('imNew', 'welcome', 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={content.imNew.welcome.message}
                  onChange={(e) => handleNestedChange('imNew', 'welcome', 'message', e.target.value)}
                  rows="4"
                />
              </div>

              <h4>What to Expect</h4>
              <div className="form-group">
                <label>Introduction</label>
                <textarea
                  value={content.imNew.whatToExpect.intro}
                  onChange={(e) => handleNestedChange('imNew', 'whatToExpect', 'intro', e.target.value)}
                  rows="2"
                />
              </div>
              
              <h5>Steps</h5>
              {content.imNew.whatToExpect.steps && content.imNew.whatToExpect.steps.map((step, index) => (
                <div key={index} className="array-item">
                  <h6>Step {index + 1}</h6>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleNestedArrayItemChange('imNew', 'whatToExpect', 'steps', index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={step.description}
                      onChange={(e) => handleNestedArrayItemChange('imNew', 'whatToExpect', 'steps', index, 'description', e.target.value)}
                      rows="2"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteNestedArrayItem('imNew', 'whatToExpect', 'steps', index)}
                    className="btn btn-danger btn-sm"
                    style={{ marginBottom: '1rem' }}
                  >
                    🗑️ Delete Step
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddNestedArrayItem('imNew', 'whatToExpect', 'steps', { title: '', description: '' })}
                className="btn btn-secondary"
                style={{ marginBottom: '1rem' }}
              >
                ➕ Add Step
              </button>

              <h4>FAQ Section</h4>
              {content.imNew.faq && content.imNew.faq.map((item, index) => (
                <div key={index} className="array-item">
                  <h6>FAQ {index + 1}</h6>
                  <div className="form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => handleArrayItemChange('imNew', 'faq', index, 'question', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Answer</label>
                    <textarea
                      value={item.answer}
                      onChange={(e) => handleArrayItemChange('imNew', 'faq', index, 'answer', e.target.value)}
                      rows="3"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteArrayItem('imNew', 'faq', index)}
                    className="btn btn-danger btn-sm"
                    style={{ marginBottom: '1rem' }}
                  >
                    🗑️ Delete FAQ
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddArrayItem('imNew', 'faq', { question: '', answer: '' })}
                className="btn btn-secondary"
                style={{ marginBottom: '1rem' }}
              >
                ➕ Add FAQ
              </button>

              <h4>Next Steps</h4>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={content.imNew.nextSteps.title}
                  onChange={(e) => handleNestedChange('imNew', 'nextSteps', 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.imNew.nextSteps.description}
                  onChange={(e) => handleNestedChange('imNew', 'nextSteps', 'description', e.target.value)}
                  rows="2"
                />
              </div>
              
              <h5>Steps List</h5>
              {content.imNew.nextSteps.steps && content.imNew.nextSteps.steps.map((step, index) => (
                <div key={index} className="array-item">
                  <div className="form-group">
                    <label>Step {index + 1}</label>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...content.imNew.nextSteps.steps];
                        newSteps[index] = e.target.value;
                        handleNestedChange('imNew', 'nextSteps', 'steps', newSteps);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newSteps = content.imNew.nextSteps.steps.filter((_, i) => i !== index);
                      handleNestedChange('imNew', 'nextSteps', 'steps', newSteps);
                    }}
                    className="btn btn-danger btn-sm"
                    style={{ marginBottom: '1rem' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newSteps = [...(content.imNew.nextSteps.steps || []), ''];
                  handleNestedChange('imNew', 'nextSteps', 'steps', newSteps);
                }}
                className="btn btn-secondary"
                style={{ marginBottom: '1rem' }}
              >
                ➕ Add Step
              </button>

              <button onClick={() => handleSave('imNew')} className="btn btn-gold" disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* Footer Section */}
          {activeSection === 'footer' && (
            <div className="editor-panel">
              <h3>📄 Footer</h3>
              <div className="form-group">
                <label>Tagline</label>
                <input
                  type="text"
                  value={content.footer.tagline}
                  onChange={(e) => handleChange('footer', 'tagline', e.target.value)}
                />
              </div>
              <h4>Social Media</h4>
              <div className="form-group">
                <label>Facebook URL</label>
                <input
                  type="url"
                  value={content.footer.socialMedia.facebook}
                  onChange={(e) => handleNestedChange('footer', 'socialMedia', 'facebook', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Instagram URL</label>
                <input
                  type="url"
                  value={content.footer.socialMedia.instagram}
                  onChange={(e) => handleNestedChange('footer', 'socialMedia', 'instagram', e.target.value)}
                />
              </div>
              <button
                onClick={() => handleSave('footer')}
                className="btn btn-gold"
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {saveStatus && (
            <div className={`save-status ${saveStatus.includes('✅') ? 'success' : saveStatus.includes('❌') ? 'error' : ''}`}>
              {saveStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContent;

