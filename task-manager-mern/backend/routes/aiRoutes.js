const express = require('express');
const router = express.Router();
const { breakdownTask } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/breakdown', protect, breakdownTask);

module.exports = router;
