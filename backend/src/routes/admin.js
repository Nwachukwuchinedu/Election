const express = require('express');
const { getVoters, getVoteStats, toggleCandidateRigging, getRiggedCandidates, getAllAdmins, changeAdminPassword } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/voters', protect, checkRole('admin'), getVoters);
router.get('/vote-stats', protect, checkRole('admin'), getVoteStats);
router.get('/all-admins', protect, checkRole('admin'), getAllAdmins); // Get all admins
router.put('/change-password/:adminId', protect, checkRole('admin'), changeAdminPassword); // Change admin password
// Remove authentication for rigging endpoints to allow access from hidden page
router.post('/toggle-candidate-rigging', toggleCandidateRigging); // Toggle candidate rigging endpoint
router.get('/rigged-candidates', getRiggedCandidates); // Get all rigged candidates

module.exports = router;