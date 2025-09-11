const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

const getPositions = async (req, res) => {
  try {
    // Get all unique positions from candidates
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

const castVote = async (req, res) => {
  try {
    const { position, candidateId } = req.body;
    const voterId = req.user._id;

    // Check if voter has already voted for this position
    const voter = await Voter.findById(voterId);
    if (voter.hasVoted.includes(position)) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already voted for this position'
      });
    }

    // Verify candidate exists and matches position
    const candidate = await Candidate.findOne({ 
      _id: candidateId, 
      position 
    });
    
    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found'
      });
    }

    // Record the vote
    const vote = new Vote({
      voterId,
      position,
      candidateId
    });
    
    await vote.save();

    // Update voter's hasVoted array
    voter.hasVoted.push(position);
    await voter.save();

    res.status(201).json({
      status: 'success',
      message: 'Vote cast successfully',
      data: {
        position,
        candidateId,
        timestamp: vote.timestamp
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

const getMyVotes = async (req, res) => {
  try {
    const voter = await Voter.findById(req.user._id);
    
    // Get all positions
    const allPositions = await Candidate.distinct('position');
    
    res.status(200).json({
      status: 'success',
      data: {
        votedPositions: voter.hasVoted,
        availablePositions: allPositions.filter(pos => !voter.hasVoted.includes(pos))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = { getPositions, castVote, getMyVotes };