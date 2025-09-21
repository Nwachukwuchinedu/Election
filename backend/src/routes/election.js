const express = require('express');
const { getElectionStatus, getElectionLogs, startElection, updateElectionStatus } = require('../controllers/electionController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { autoGenerateAndSendResults } = require('../controllers/resultsController'); // Add results controller

const router = express.Router();

// Public route to get election status (for voters to see countdown)
router.get('/status', getElectionStatus);

// Admin routes
router.post('/start', protect, checkRole('admin'), startElection);
router.put('/status', protect, checkRole('admin'), updateElectionStatus);
router.get('/logs/:electionId?', protect, checkRole('admin'), getElectionLogs); // Update logs endpoint to support optional electionId

// New route to manually generate and send election results
router.post('/generate-results', protect, checkRole('admin'), async (req, res) => {
  try {
    // Get the most recent election
    const election = await require('../models/Election').findOne().sort({ createdAt: -1 });
    
    if (!election) {
      return res.status(404).json({
        status: 'error',
        message: 'No election found'
      });
    }
    
    // Generate and send results
    await autoGenerateAndSendResults(election._id);
    
    res.status(200).json({
      status: 'success',
      message: 'Election results generated and sent successfully'
    });
  } catch (error) {
    console.error('Error generating election results:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate and send election results'
    });
  }
});

module.exports = router;