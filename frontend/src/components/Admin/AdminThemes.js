import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import './AdminThemes.css';

const AdminThemes = () => {
  const [themes, setThemes] = useState(null);
  const [themeLoading, setThemeLoading] = useState(false);
  const [themeMessage, setThemeMessage] = useState({ type: '', text: '' });
  const [uploadingFlyer, setUploadingFlyer] = useState({});
  const [flyerPreview, setFlyerPreview] = useState({});
  const [selectedFlyerFile, setSelectedFlyerFile] = useState({});
  const [editingYear, setEditingYear] = useState({});
  const [showAddYear, setShowAddYear] = useState(false);
  const [newYear, setNewYear] = useState('');

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await axios.get('/api/content');
      if (response.data.themes) {
        setThemes(response.data.themes);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    }
  };

  const handleThemeChange = async (year, field, value) => {
    if (!themes) return;
    
    const updatedThemes = {
      ...themes,
      [year]: {
        ...themes[year],
        [field]: value
      }
    };

    try {
      setThemeLoading(true);
      setThemeMessage({ type: '', text: '' });
      
      // Save updated themes
      await axios.put('/api/content/themes', updatedThemes);
      
      setThemes(updatedThemes);
      setThemeMessage({ type: 'success', text: 'Theme updated successfully!' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating theme:', error);
      setThemeMessage({ type: 'error', text: 'Failed to update theme' });
    } finally {
      setThemeLoading(false);
    }
  };

  const handleFlyerFileChange = (year, file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setThemeMessage({ type: 'error', text: 'Please select an image file' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setThemeMessage({ type: 'error', text: 'Image must be less than 5MB' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
      return;
    }

    // Store the file
    setSelectedFlyerFile(prev => ({ ...prev, [year]: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFlyerPreview(prev => ({ ...prev, [year]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFlyerUpload = async (year) => {
    const file = selectedFlyerFile[year];
    if (!file || !themes) return;

    try {
      setUploadingFlyer(prev => ({ ...prev, [year]: true }));
      setThemeMessage({ type: '', text: '' });

      // Upload the file
      const formData = new FormData();
      formData.append('image', file);
      formData.append('uploadType', 'themes');

      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.data.success && uploadResponse.data.url) {
        // Update theme with flyer URL
        await handleThemeChange(year, 'flyerUrl', uploadResponse.data.url);
        setThemeMessage({ type: 'success', text: 'Flyer uploaded successfully!' });
        setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
        
        // Clear preview and selected file
        setFlyerPreview(prev => {
          const newPreview = { ...prev };
          delete newPreview[year];
          return newPreview;
        });
        setSelectedFlyerFile(prev => {
          const newFile = { ...prev };
          delete newFile[year];
          return newFile;
        });
      }
    } catch (error) {
      console.error('Error uploading flyer:', error);
      setThemeMessage({ type: 'error', text: 'Failed to upload flyer' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
    } finally {
      setUploadingFlyer(prev => ({ ...prev, [year]: false }));
    }
  };

  const handleRemoveFlyer = async (year) => {
    if (!window.confirm('Are you sure you want to remove this flyer?')) {
      return;
    }

    try {
      await handleThemeChange(year, 'flyerUrl', '');
      setThemeMessage({ type: 'success', text: 'Flyer removed successfully!' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error removing flyer:', error);
      setThemeMessage({ type: 'error', text: 'Failed to remove flyer' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleYearChange = async (oldYear, newYear) => {
    if (!themes || !newYear || newYear === oldYear) return;

    // Validate year format (should be 4 digits)
    if (!/^\d{4}$/.test(newYear)) {
      setThemeMessage({ type: 'error', text: 'Year must be 4 digits (e.g., 2025)' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
      return;
    }

    // Check if new year already exists
    if (themes[newYear]) {
      setThemeMessage({ type: 'error', text: `Theme for year ${newYear} already exists` });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      setThemeLoading(true);
      setThemeMessage({ type: '', text: '' });

      // Create new themes object with updated year
      const updatedThemes = { ...themes };
      updatedThemes[newYear] = { ...themes[oldYear] };
      delete updatedThemes[oldYear];

      // Save updated themes
      await axios.put('/api/content/themes', updatedThemes);
      
      setThemes(updatedThemes);
      setEditingYear(prev => {
        const newEditing = { ...prev };
        delete newEditing[oldYear];
        return newEditing;
      });
      setThemeMessage({ type: 'success', text: 'Year updated successfully!' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating year:', error);
      setThemeMessage({ type: 'error', text: 'Failed to update year' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
    } finally {
      setThemeLoading(false);
    }
  };

  const handleAddYear = async () => {
    if (!newYear || !/^\d{4}$/.test(newYear)) {
      setThemeMessage({ type: 'error', text: 'Please enter a valid 4-digit year (e.g., 2025)' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (themes[newYear]) {
      setThemeMessage({ type: 'error', text: `Theme for year ${newYear} already exists` });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      setThemeLoading(true);
      setThemeMessage({ type: '', text: '' });

      // Create new theme with default values
      const updatedThemes = {
        ...themes,
        [newYear]: {
          title: '',
          scripture: '',
          description: '',
          active: false,
          flyerUrl: ''
        }
      };

      // Save updated themes
      await axios.put('/api/content/themes', updatedThemes);
      
      const addedYear = newYear;
      setThemes(updatedThemes);
      setNewYear('');
      setShowAddYear(false);
      setThemeMessage({ type: 'success', text: `Theme for year ${addedYear} added successfully!` });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error adding year:', error);
      setThemeMessage({ type: 'error', text: 'Failed to add year' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
    } finally {
      setThemeLoading(false);
    }
  };

  const handleDeleteYear = async (year) => {
    if (!window.confirm(`Are you sure you want to delete the theme for year ${year}? This action cannot be undone.`)) {
      return;
    }

    try {
      setThemeLoading(true);
      setThemeMessage({ type: '', text: '' });

      // Create new themes object without the deleted year
      const updatedThemes = { ...themes };
      delete updatedThemes[year];

      // Save updated themes
      await axios.put('/api/content/themes', updatedThemes);
      
      setThemes(updatedThemes);
      setThemeMessage({ type: 'success', text: `Theme for year ${year} deleted successfully!` });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error deleting year:', error);
      setThemeMessage({ type: 'error', text: 'Failed to delete year' });
      setTimeout(() => setThemeMessage({ type: '', text: '' }), 3000);
    } finally {
      setThemeLoading(false);
    }
  };

  return (
    <div className="admin-themes">
      <div className="section-header">
        <h2>📖 Church Themes Management</h2>
        <p className="section-description">Manage annual church themes that appear on the website</p>
      </div>

      {themes ? (
        <div className="themes-management">
          {/* Add New Year Button */}
          <div className="add-year-section">
            {!showAddYear ? (
              <button
                onClick={() => setShowAddYear(true)}
                className="btn btn-primary"
                disabled={themeLoading}
              >
                ➕ Add New Year Theme
              </button>
            ) : (
              <div className="add-year-form">
                <div className="form-group">
                  <label>Enter Year (e.g., 2027)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      placeholder="2027"
                      maxLength="4"
                      pattern="\d{4}"
                      disabled={themeLoading}
                      style={{ width: '150px' }}
                    />
                    <button
                      onClick={handleAddYear}
                      className="btn btn-primary btn-small"
                      disabled={themeLoading || !newYear}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddYear(false);
                        setNewYear('');
                      }}
                      className="btn btn-secondary btn-small"
                      disabled={themeLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Theme Cards */}
          {Object.keys(themes).sort((a, b) => b.localeCompare(a)).map(year => (
            <div key={year} className="theme-card">
              <div className="theme-card-header">
                {editingYear[year] ? (
                  <div className="year-edit-form">
                    <input
                      type="text"
                      value={editingYear[year]}
                      onChange={(e) => setEditingYear(prev => ({ ...prev, [year]: e.target.value }))}
                      placeholder="Year"
                      maxLength="4"
                      pattern="\d{4}"
                      disabled={themeLoading}
                      style={{ width: '100px', marginRight: '0.5rem' }}
                    />
                    <button
                      onClick={() => handleYearChange(year, editingYear[year])}
                      className="btn btn-primary btn-small"
                      disabled={themeLoading || editingYear[year] === year}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingYear(prev => {
                          const newEditing = { ...prev };
                          delete newEditing[year];
                          return newEditing;
                        });
                      }}
                      className="btn btn-secondary btn-small"
                      disabled={themeLoading}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="theme-card-title-row">
                    <h3>{year} Theme</h3>
                    <div className="theme-card-actions">
                      <button
                        onClick={() => setEditingYear(prev => ({ ...prev, [year]: year }))}
                        className="btn btn-secondary btn-small"
                        disabled={themeLoading}
                        title="Edit Year"
                      >
                        ✏️ Edit Year
                      </button>
                      <button
                        onClick={() => handleDeleteYear(year)}
                        className="btn btn-danger btn-small"
                        disabled={themeLoading}
                        title="Delete Theme"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Theme Title *</label>
                <input
                  type="text"
                  value={themes[year]?.title || ''}
                  onChange={(e) => handleThemeChange(year, 'title', e.target.value)}
                  placeholder="Theme title"
                  disabled={themeLoading}
                />
              </div>
              <div className="form-group">
                <label>Scripture Reference</label>
                <input
                  type="text"
                  value={themes[year]?.scripture || ''}
                  onChange={(e) => handleThemeChange(year, 'scripture', e.target.value)}
                  placeholder="e.g., Ephesians 4:1, 1 Thessalonians 4:7"
                  disabled={themeLoading}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={themes[year]?.description || ''}
                  onChange={(e) => handleThemeChange(year, 'description', e.target.value)}
                  rows="4"
                  placeholder="Theme description"
                  disabled={themeLoading}
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={themes[year]?.active || false}
                    onChange={(e) => handleThemeChange(year, 'active', e.target.checked)}
                    disabled={themeLoading}
                  />
                  <span>Active Theme (display on website)</span>
                </label>
              </div>
              <div className="form-group">
                <label>Theme Flyer (Optional)</label>
                {themes[year]?.flyerUrl ? (
                  <div className="flyer-preview-container">
                    <img 
                      src={themes[year].flyerUrl} 
                      alt="Theme Flyer" 
                      className="flyer-preview"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFlyer(year)}
                      className="btn btn-danger btn-small"
                      disabled={themeLoading || uploadingFlyer[year]}
                    >
                      Remove Flyer
                    </button>
                  </div>
                ) : (
                  <div className="flyer-upload-container">
                    {flyerPreview[year] ? (
                      <div className="flyer-preview-container">
                        <img 
                          src={flyerPreview[year]} 
                          alt="Preview" 
                          className="flyer-preview"
                        />
                        <div className="flyer-upload-actions">
                          <input
                            type="file"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                handleFlyerFileChange(year, e.target.files[0]);
                              }
                            }}
                            accept="image/*"
                            style={{ display: 'none' }}
                            id={`flyer${year}`}
                          />
                          <label htmlFor={`flyer${year}`} className="btn btn-secondary btn-small">
                            Change
                          </label>
                          <button
                            type="button"
                            onClick={() => handleFlyerUpload(year)}
                            className="btn btn-primary btn-small"
                            disabled={uploadingFlyer[year]}
                          >
                            {uploadingFlyer[year] ? 'Uploading...' : 'Upload'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFlyerPreview(prev => {
                                const newPreview = { ...prev };
                                delete newPreview[year];
                                return newPreview;
                              });
                              setSelectedFlyerFile(prev => {
                                const newFile = { ...prev };
                                delete newFile[year];
                                return newFile;
                              });
                              const input = document.getElementById(`flyer${year}`);
                              if (input) input.value = '';
                            }}
                            className="btn btn-secondary btn-small"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleFlyerFileChange(year, e.target.files[0]);
                            }
                          }}
                          accept="image/*"
                          style={{ display: 'none' }}
                          id={`flyer${year}`}
                        />
                        <label htmlFor={`flyer${year}`} className="btn btn-secondary">
                          Choose Flyer Image
                        </label>
                        <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                          Max size: 5MB. Formats: JPG, PNG, WebP
                        </small>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {themeMessage.text && (
            <div className={`message ${themeMessage.type}`} style={{ marginTop: '1rem' }}>
              {themeMessage.text}
            </div>
          )}
        </div>
      ) : (
        <div className="loading-state">Loading themes...</div>
      )}
    </div>
  );
};

export default AdminThemes;

