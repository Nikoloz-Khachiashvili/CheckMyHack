const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/users');
const { JWT_SECRET } = require('../config');

const router = express.Router();

// ===== Signup Route =====
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (email, passwordHash) VALUES (?, ?)`;

    db.run(query, [email, passwordHash], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Email already registered' });
        }
        return res.status(500).json({ error: 'Database error' });
      }

      const token = jwt.sign({ userId: this.lastID, email }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// ===== Login Route =====
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

module.exports = router;
