const express = require('express');
const { getVoters, getVoteStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/voters', protect, checkRole('admin'), getVoters);
router.get('/vote-stats', protect, checkRole('admin'), getVoteStats);

module.exports = router;