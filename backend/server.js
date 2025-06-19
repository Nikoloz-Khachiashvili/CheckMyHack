const express = require('express');
const cors = require('cors');

const checkBreachRouter = require('./routes/checkBreach');
const authRouter = require('./routes/auth');
const historyRoutes = require('./routes/history'); // ✅ Added for history

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/check', checkBreachRouter);
app.use('/api/auth', authRouter);
app.use('/api/history', historyRoutes); // ✅ History route

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
