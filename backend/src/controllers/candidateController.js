const Candidate = require('../models/Candidate');

const getCandidates = async (req, res) => {
  try {
    // Get all unique positions
    const positions = await Candidate.distinct('position');
    
    // Group candidates by position
    const candidatesByPosition = {};
    
    for (const position of positions) {
      candidatesByPosition[position] = await Candidate.find({ position });
    }
    
    res.status(200).json({
      status: 'success',
      data: candidatesByPosition
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: candidate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = { getCandidates, getCandidateById };