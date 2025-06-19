const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const router = express.Router();
const historyFile = path.join(__dirname, '..', '..', 'db', 'history.json');

// Ensure history file exists
if (!fs.existsSync(historyFile)) {
  fs.writeFileSync(historyFile, '[]', 'utf-8');
}

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'You need to be logged in to make email checkup requests' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// GET /api/history - only return history for this user
router.get('/', authenticate, (req, res) => {
  try {
    const allHistory = JSON.parse(fs.readFileSync(historyFile));
    const userHistory = allHistory.filter((entry) => entry.userId === req.user.userId);
    res.json(userHistory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read history' });
  }
});

// POST /api/history - store history for this user
router.post('/', authenticate, (req, res) => {
  const { email, breachCount, checkedAt } = req.body;

  if (!email || breachCount === undefined || !checkedAt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const allHistory = JSON.parse(fs.readFileSync(historyFile));
    const newEntry = {
      id: Date.now(),
      email,
      breachCount,
      checkedAt,
      userId: req.user.userId,
    };

    allHistory.unshift(newEntry);
    fs.writeFileSync(historyFile, JSON.stringify(allHistory, null, 2));
    res.status(201).json({ message: 'Entry added to history' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write to history' });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    const id = Number(req.params.id);
    const history = JSON.parse(fs.readFileSync(historyFile));

    const entryIndex = history.findIndex(
      (entry) => entry.id === id && entry.userId === req.user.userId
    );

    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Entry not found or not authorized' });
    }

    history.splice(entryIndex, 1);
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

module.exports = router;
