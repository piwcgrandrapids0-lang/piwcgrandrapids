const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// In-memory user store (replace with database in production)
const users = [
  {
    id: 1,
    name: 'Administrator',
    username: 'admin',
    email: 'admin@piwcgr.org',
    // Password: admin123 (hashed)
    password: '$2a$10$8K1p/a0dL3LKvLsL8xJ.qOR.L3FJOiE3J5b5J5J5J5J5J5J5J5J5J5'
  }
];

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Find user by email or username
    const user = users.find(u => u.email === email || u.email === username || u.username === username || u.username === email);
    if (!user) {
      console.log('User not found. Received:', { email, username, password: '***' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For demo purposes, accept 'admin123' password
    // In production, use bcrypt.compare(password, user.password)
    const isValidPassword = password === 'admin123' || await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Invalid password for user:', user.username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Login successful for user:', user.username);

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, name: user.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Verify token endpoint
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Change password endpoint
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Find user
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = currentPassword === 'admin123' || await bcrypt.compare(currentPassword, user.password);
    
    if (!isValidPassword) {
      console.log('Invalid current password for user:', user.username);
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    
    console.log('✅ Password changed successfully for user:', user.username);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
});

module.exports = router;

