const express = require('express');
const { getPositions, castVote, getMyVotes } = require('../controllers/voterController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getPositions);
router.post('/votes', protect, castVote);
router.get('/votes/my-votes', protect, getMyVotes);

module.exports = router;