const express = require('express');
const router = express.Router();
const { checkEmail, getHistory } = require('../controllers/checkController');

router.post('/check', checkEmail);
router.get('/history', getHistory);

module.exports = router;
