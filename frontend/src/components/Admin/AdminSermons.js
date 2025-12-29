import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import './AdminSermons.css';

const AdminSermons = () => {
  const [sermons, setSermons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSermon, setEditingSermon] = useState(null);
  const [videoSource, setVideoSource] = useState('youtube'); // 'youtube' or 'upload'
  const [messageType, setMessageType] = useState('video'); // 'video', 'text', or 'slides'
  const [uploading, setUploading] = useState(false);
  const [uploadingSlides, setUploadingSlides] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    date: '',
    series: '',
    description: '',
    videoUrl: '',
    textContent: '',
    slidesUrl: '',
    isLatest: false
  });

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const response = await axios.get('/api/sermons');
      setSermons(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      setSermons([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('uploadType', 'videos');
    
    try {
      const response = await axios.post('/api/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        alert(`Video uploaded successfully! (${(response.data.size / (1024 * 1024)).toFixed(2)} MB)`);
        setFormData(prev => ({ ...prev, videoUrl: response.data.url }));
      } else {
        alert(`Upload failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Video upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSlidesUpload = async (file) => {
    if (!file) return;
    
    setUploadingSlides(true);
    const uploadFormData = new FormData();
    uploadFormData.append('document', file);
    uploadFormData.append('uploadType', 'slides');
    
    try {
      const response = await axios.post('/api/upload-document', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        alert(`Slides uploaded successfully! (${(response.data.size / (1024 * 1024)).toFixed(2)} MB)`);
        setFormData(prev => ({ ...prev, slidesUrl: response.data.url }));
      } else {
        alert(`Upload failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Slides upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingSlides(false);
    }
  };

  // Convert YouTube URL to embed format before saving
  const normalizeVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    
    url = url.trim();
    
    // If already an embed URL, validate and return
    if (url.includes('youtube.com/embed/')) {
      const embedMatch = url.match(/embed\/([^?&]+)/);
      if (embedMatch && embedMatch[1] && /^[a-zA-Z0-9_-]{11}$/.test(embedMatch[1])) {
        return `https://www.youtube.com/embed/${embedMatch[1]}`;
      }
    }
    
    // Extract video ID from various formats
    let videoId = null;
    
    // youtube.com/watch?v=VIDEO_ID or youtube.com/v/VIDEO_ID
    const watchMatch = url.match(/(?:[?&]v=|v\/)([^&?#]+)/);
    if (watchMatch && watchMatch[1]) {
      videoId = watchMatch[1].split('&')[0].split('#')[0];
    }
    
    // youtube.com/live/VIDEO_ID (live streams)
    if (!videoId) {
      const liveMatch = url.match(/youtube\.com\/live\/([^?&#]+)/);
      if (liveMatch && liveMatch[1]) {
        videoId = liveMatch[1];
      }
    }
    
    // youtu.be/VIDEO_ID
    if (!videoId) {
      const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
      if (shortMatch && shortMatch[1]) {
        videoId = shortMatch[1];
      }
    }
    
    // Validate and return embed URL
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // If it's a YouTube URL but we couldn't extract a valid video ID, return empty string
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return '';
    }
    
    // Return original if it's not a YouTube URL (might be a different video platform)
    return url;
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert YouTube URL to embed format using improved normalization
    let videoUrl = normalizeVideoUrl(formData.videoUrl);
    
    // Validate video URL
    if (formData.videoUrl && formData.videoUrl.trim()) {
      // If normalization returned empty string or original URL unchanged (and it's not a valid embed URL), it's invalid
      if (!videoUrl || videoUrl === '' || (videoUrl === formData.videoUrl && !videoUrl.includes('embed/'))) {
        // Check if it's a YouTube URL that failed to normalize
        if (formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be')) {
          alert('Invalid YouTube URL. Please use a valid YouTube video URL.\n\nSupported formats:\n- https://www.youtube.com/watch?v=VIDEO_ID\n- https://youtu.be/VIDEO_ID\n- https://www.youtube.com/live/VIDEO_ID\n- https://www.youtube.com/embed/VIDEO_ID');
          return;
        }
      }
    }

    try {
      const url = editingSermon ? `/api/sermons/${editingSermon.id}` : '/api/sermons';
      
      const payload = {
        ...formData,
        messageType,
        videoUrl: messageType === 'video' ? videoUrl : ''
      };
      
      if (editingSermon) {
        await axios.put(url, payload);
      } else {
        await axios.post(url, payload);
      }
      
      fetchSermons();
      resetForm();
      alert(editingSermon ? 'Sermon updated!' : 'Sermon added!');
    } catch (error) {
      console.error('Error saving sermon:', error);
      alert('Error saving sermon');
    }
  };

  const handleEdit = (sermon) => {
    setEditingSermon(sermon);
    setMessageType(sermon.messageType || 'video');
    setFormData({
      title: sermon.title,
      speaker: sermon.speaker,
      date: sermon.date,
      series: sermon.series,
      description: sermon.description,
      videoUrl: sermon.videoUrl || '',
      textContent: sermon.textContent || '',
      slidesUrl: sermon.slidesUrl || '',
      isLatest: sermon.isLatest || false
    });
    setShowForm(true);
  };

  const handleDelete = async (sermonId) => {
    if (!window.confirm('Are you sure you want to delete this sermon?')) return;

    try {
      await axios.delete(`/api/sermons/${sermonId}`);
      fetchSermons();
      alert('Sermon deleted!');
    } catch (error) {
      console.error('Error deleting sermon:', error);
      alert('Error deleting sermon');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      speaker: '',
      date: '',
      series: '',
      description: '',
      videoUrl: '',
      textContent: '',
      slidesUrl: '',
      isLatest: false
    });
    setMessageType('video');
    setEditingSermon(null);
    setShowForm(false);
  };

  return (
    <div className="admin-sermons">
      <div className="section-header">
        <h2>🎥 Sermons Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-gold">
          {showForm ? '✕ Cancel' : '➕ Add Sermon'}
        </button>
      </div>

      {showForm && (
        <div className="sermon-form-container">
          <h3>{editingSermon ? 'Edit Sermon' : 'Add New Sermon'}</h3>
          <form onSubmit={handleSubmit} className="sermon-form">
            <div className="form-row">
              <div className="form-group">
                <label>Sermon Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., The Power of Prayer"
                />
              </div>
              <div className="form-group">
                <label>Speaker *</label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Pastor John Doe"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Series</label>
                <input
                  type="text"
                  name="series"
                  value={formData.series}
                  onChange={handleChange}
                  placeholder="e.g., Faith Series"
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isLatest"
                    checked={formData.isLatest || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isLatest: e.target.checked }))}
                  />
                  {' '}⭐ Mark as Latest Message
                </label>
                <small>Only one sermon can be marked as latest</small>
              </div>
            </div>

            <div className="form-group">
              <label>Message Type *</label>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="video"
                    checked={messageType === 'video'}
                    onChange={(e) => setMessageType(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  📺 Video
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="text"
                    checked={messageType === 'text'}
                    onChange={(e) => setMessageType(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  📝 Text Message
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="slides"
                    checked={messageType === 'slides'}
                    onChange={(e) => setMessageType(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  📊 Slides
                </label>
              </div>

              {messageType === 'video' && (
                <>
                  <label>Video Source</label>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        value="youtube"
                        checked={videoSource === 'youtube'}
                        onChange={(e) => setVideoSource(e.target.value)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      📺 YouTube URL
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        value="upload"
                        checked={videoSource === 'upload'}
                        onChange={(e) => setVideoSource(e.target.value)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      📤 Upload Video File
                    </label>
                  </div>

                  {videoSource === 'youtube' ? (
                    <>
                      <input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleChange}
                        required={messageType === 'video'}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <small>Paste any YouTube URL - it will be automatically converted to embed format</small>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            value={formData.videoUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="/uploads/videos/sermon.mp4"
                            readOnly={uploading}
                          />
                          <small>Video URL (auto-filled after upload)</small>
                        </div>
                        <div>
                          <label 
                            htmlFor="videoFileUpload" 
                            className="btn btn-secondary" 
                            style={{ cursor: 'pointer', margin: 0 }}
                          >
                            {uploading ? '⏳ Uploading...' : '📤 Upload Video'}
                          </label>
                          <input
                            id="videoFileUpload"
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                handleVideoUpload(file);
                              }
                            }}
                            disabled={uploading}
                          />
                        </div>
                      </div>
                      <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                        ⚠️ Maximum file size: 100MB. Supported formats: MP4, MOV, AVI, WMV, FLV, MKV, WEBM
                      </small>
                    </>
                  )}
                </>
              )}

              {messageType === 'text' && (
                <>
                  <label>Message Text *</label>
                  <textarea
                    name="textContent"
                    value={formData.textContent}
                    onChange={handleChange}
                    required={messageType === 'text'}
                    rows="12"
                    placeholder="Enter your message text here. You can use line breaks for paragraphs..."
                    style={{ fontFamily: 'inherit', fontSize: '1rem' }}
                  />
                  <small>Enter the full text of your message. This will replace the video on the home page.</small>
                </>
              )}

              {messageType === 'slides' && (
                <>
                  <label>Slides File *</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={formData.slidesUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, slidesUrl: e.target.value }))}
                        placeholder="/uploads/slides/sermon.pdf"
                        readOnly={uploadingSlides}
                      />
                      <small>Slides URL (auto-filled after upload)</small>
                    </div>
                    <div>
                      <label 
                        htmlFor="slidesFileUpload" 
                        className="btn btn-secondary" 
                        style={{ cursor: 'pointer', margin: 0 }}
                      >
                        {uploadingSlides ? '⏳ Uploading...' : '📤 Upload Slides'}
                      </label>
                      <input
                        id="slidesFileUpload"
                        type="file"
                        accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleSlidesUpload(file);
                          }
                        }}
                        disabled={uploadingSlides}
                      />
                    </div>
                  </div>
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                    ⚠️ Maximum file size: 50MB. Supported formats: PDF, PowerPoint (PPT, PPTX), or Images (JPG, PNG, GIF, WEBP)
                  </small>
                </>
              )}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Brief description of the sermon..."
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingSermon ? '💾 Update Sermon' : '➕ Add Sermon'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="sermons-list">
        <h3>All Sermons ({sermons.length})</h3>
        {sermons.length === 0 ? (
          <div className="empty-state">
            <p>No sermons yet. Add your first sermon!</p>
          </div>
        ) : (
          <div className="sermons-grid">
            {sermons.map(sermon => (
              <div key={sermon.id} className="sermon-card">
                <div className="sermon-video">
                  {sermon.videoUrl ? (
                    <iframe
                      src={`${sermon.videoUrl}?feature=oembed&rel=0&modestbranding=1`}
                      title={sermon.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    ></iframe>
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: '#f0f0f0',
                      color: '#666'
                    }}>
                      <p>Video URL not available</p>
                    </div>
                  )}
                </div>
                <div className="sermon-info">
                  <h4>{sermon.isLatest ? '⭐ ' : ''}{sermon.title}</h4>
                  <p className="sermon-meta">
                    <strong>🎤 Speaker:</strong> {sermon.speaker}<br />
                    <strong>📅 Date:</strong> {new Date(sermon.date).toLocaleDateString()}<br />
                    {sermon.series && <><strong>📚 Series:</strong> {sermon.series}<br /></>}
                    {sermon.isLatest && <><strong>⭐ Latest Message</strong><br /></>}
                  </p>
                  <p className="sermon-description">{sermon.description}</p>
                  <div className="sermon-actions">
                    <button onClick={() => handleEdit(sermon)} className="btn btn-secondary btn-small">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(sermon.id)} className="btn btn-danger btn-small">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSermons;

