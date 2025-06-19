const express = require('express');
const router = express.Router();
const { checkMockBreach } = require('../services/mockBreachService');

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const breachData = await checkMockBreach(email);
    res.json(breachData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
