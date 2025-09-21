const express = require('express');
const { login, verifyToken, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/verify-token', protect, verifyToken);
router.put('/change-password', protect, changePassword); // Add change password route

module.exports = router;