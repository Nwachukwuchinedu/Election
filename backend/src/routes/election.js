const express = require('express');
const { getElectionStatus, getElectionLogs, startElection, updateElectionStatus } = require('../controllers/electionController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public route to get election status (for voters to see countdown)
router.get('/status', getElectionStatus);

// Admin routes
router.post('/start', protect, checkRole('admin'), startElection);
router.put('/status', protect, checkRole('admin'), updateElectionStatus);
router.get('/logs/:electionId?', protect, checkRole('admin'), getElectionLogs); // Add logs endpoint

module.exports = router;