const express = require('express');
const { getCandidates, getCandidateById } = require('../controllers/candidateController');

const router = express.Router();

router.get('/', getCandidates);
router.get('/:id', getCandidateById);

module.exports = router;