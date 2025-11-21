const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const usersFilePath = path.join(__dirname, '../data/users.json');
const defaultUsers = [
  {
    id: 1,
    name: 'Administrator',
    username: 'admin',
    email: 'admin@piwcgr.org',
    // Password: admin123 (hashed)
    password: '$2a$10$mL4vbG5IXOyqEgO9Ky3k6OnxZ1yu2uLra5RoCaul9PAeHOPIklLla'
  }
];

const ensureUsersFile = () => {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify(defaultUsers, null, 2), 'utf8');
  }
};

// Migration: Fix old placeholder password hash
const migrateUsers = (users) => {
  const oldPlaceholderHash = '$2a$10$8K1p/a0dL3LKvLsL8xJ.qOR.L3FJOiE3J5b5J5J5J5J5J5J5J5J5J5';
  const correctHash = '$2a$10$mL4vbG5IXOyqEgO9Ky3k6OnxZ1yu2uLra5RoCaul9PAeHOPIklLla';
  
  let updated = false;
  users.forEach(user => {
    if (user.password === oldPlaceholderHash) {
      console.log('Migrating password hash for user:', user.username);
      user.password = correctHash;
      updated = true;
    }
  });
  
  if (updated) {
    writeUsers(users);
    console.log('Password hash migration completed');
  }
  
  return users;
};

const readUsers = () => {
  try {
    ensureUsersFile();
    const data = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(data);
    return migrateUsers(users);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [...defaultUsers];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const users = readUsers();
    // Find user by email or username
    const user = users.find(u => u.email === email || u.email === username || u.username === username || u.username === email);
    if (!user) {
      console.log('User not found. Received:', { email, username, password: '***' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Invalid password for user:', user.username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', user.username);

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

    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    const user = users[userIndex];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValidPassword) {
      console.log('Invalid current password for user:', user.username);
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    users[userIndex].password = hashedPassword;

    if (!writeUsers(users)) {
      throw new Error('Failed to persist updated password');
    }
    
    console.log('Password changed successfully for user:', user.username);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
});

module.exports = router;

