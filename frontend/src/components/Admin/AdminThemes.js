import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import './AdminThemes.css';

const AdminThemes = () => {
  const [themes, setThemes] = useState(null);
  const [themeLoading, setThemeLoading] = useState(false);
  const [themeMessage, setThemeMessage] = useState({ type: '', text: '' });

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

  return (
    <div className="admin-themes">
      <div className="section-header">
        <h2>📖 Church Themes Management</h2>
        <p className="section-description">Manage annual church themes that appear on the website</p>
      </div>

      {themes ? (
        <div className="themes-management">
          {/* 2025 Theme */}
          <div className="theme-card">
            <h3>2025 Theme</h3>
            <div className="form-group">
              <label>Theme Title *</label>
              <input
                type="text"
                value={themes['2025']?.title || ''}
                onChange={(e) => handleThemeChange('2025', 'title', e.target.value)}
                placeholder="Theme title"
                disabled={themeLoading}
              />
            </div>
            <div className="form-group">
              <label>Scripture Reference</label>
              <input
                type="text"
                value={themes['2025']?.scripture || ''}
                onChange={(e) => handleThemeChange('2025', 'scripture', e.target.value)}
                placeholder="e.g., Ephesians 4:1, 1 Thessalonians 4:7"
                disabled={themeLoading}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={themes['2025']?.description || ''}
                onChange={(e) => handleThemeChange('2025', 'description', e.target.value)}
                rows="4"
                placeholder="Theme description"
                disabled={themeLoading}
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={themes['2025']?.active || false}
                  onChange={(e) => handleThemeChange('2025', 'active', e.target.checked)}
                  disabled={themeLoading}
                />
                <span>Active Theme (display on website)</span>
              </label>
            </div>
          </div>

          {/* 2026 Theme */}
          <div className="theme-card">
            <h3>2026 Theme</h3>
            <div className="form-group">
              <label>Theme Title *</label>
              <input
                type="text"
                value={themes['2026']?.title || ''}
                onChange={(e) => handleThemeChange('2026', 'title', e.target.value)}
                placeholder="Theme title"
                disabled={themeLoading}
              />
            </div>
            <div className="form-group">
              <label>Scripture Reference</label>
              <input
                type="text"
                value={themes['2026']?.scripture || ''}
                onChange={(e) => handleThemeChange('2026', 'scripture', e.target.value)}
                placeholder="Scripture references"
                disabled={themeLoading}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={themes['2026']?.description || ''}
                onChange={(e) => handleThemeChange('2026', 'description', e.target.value)}
                rows="4"
                placeholder="Theme description"
                disabled={themeLoading}
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={themes['2026']?.active || false}
                  onChange={(e) => handleThemeChange('2026', 'active', e.target.checked)}
                  disabled={themeLoading}
                />
                <span>Active Theme (display on website)</span>
              </label>
            </div>
          </div>

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

