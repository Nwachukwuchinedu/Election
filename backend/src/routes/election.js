const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const {
  getStatus,
  startElection,
  updateStatus,
  getLogs,
  generateResults
} = require('../controllers/electionController');

const router = express.Router();

// Public: voters need to read election status
router.get('/status', getStatus);
router.post('/start', protect, checkRole('admin'), startElection);
router.put('/status', protect, checkRole('admin'), updateStatus);
router.get('/logs/:electionId', protect, checkRole('admin'), getLogs);
router.post('/generate-results', protect, checkRole('admin'), generateResults);

module.exports = router;