const db = require('../db/initDb');

const checkMockBreach = (email) => {
  const domains = ['example.com', 'test.com'];
  const breached = domains.includes(email.split('@')[1]);
  return breached ? [{ Name: 'MockBreach', BreachDate: '2023-01-01', Description: 'Mock data breach.' }] : [];
};

const checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const breaches = checkMockBreach(email);
    const breachCount = breaches.length;

    db.run(
      `INSERT INTO history (email, breachCount) VALUES (?, ?)`,
      [email, breachCount],
      (err) => {
        if (err) console.error('DB Insert Error:', err);
      }
    );

    res.json(breaches);
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getHistory = (req, res) => {
  db.all(`SELECT * FROM history ORDER BY checkedAt DESC LIMIT 20`, (err, rows) => {
    if (err) {
      console.error('DB History Error:', err);
      return res.status(500).json({ error: 'Could not fetch history' });
    }
    res.json(rows);
  });
};

module.exports = { checkEmail, getHistory };
