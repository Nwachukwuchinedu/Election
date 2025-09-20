const Voter = require('../models/Voter');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const { setRiggingSettings, getRiggingSettings } = require('./voterController');

const getVoters = async (req, res) => {
  try {
    const { level, hasVoted } = req.query;
    
    // Build query
    let query = {};
    
    if (level) {
      query.level = parseInt(level);
    }
    
    if (hasVoted === 'true') {
      query.hasVoted = { $ne: [] };
    } else if (hasVoted === 'false') {
      query.hasVoted = { $size: 0 };
    }
    
    // Get voters
    const voters = await Voter.find(query);
    
    // Add vote count to each voter
    const votersWithVoteCount = await Promise.all(
      voters.map(async (voter) => {
        const voteCount = voter.hasVoted.length;
        return {
          ...voter._doc,
          totalVotes: voteCount
        };
      })
    );
    
    // Get statistics
    const totalVoters = await Voter.countDocuments();
    const votersWhoVoted = await Voter.countDocuments({ hasVoted: { $ne: [] } });
    const votersWhoNotVoted = totalVoters - votersWhoVoted;
    
    res.status(200).json({
      status: 'success',
      data: {
        voters: votersWithVoteCount,
        totalVoters,
        votersWhoVoted,
        votersWhoNotVoted
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

const getVoteStats = async (req, res) => {
  try {
    // Get all positions
    const positions = await Candidate.distinct('position');
    
    // For each position, get vote statistics
    const stats = {};
    
    for (const position of positions) {
      // Get total votes for this position
      const totalVotes = await Vote.countDocuments({ position });
      
      // Get candidates for this position
      const candidates = await Candidate.find({ position });
      
      // For each candidate, count their votes
      const candidateStats = await Promise.all(
        candidates.map(async (candidate) => {
          const votes = await Vote.countDocuments({
            position,
            candidateId: candidate._id
          });
          
          return {
            _id: candidate._id,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            position: candidate.position,
            voteCount: votes
          };
        })
      );
      
      stats[position] = {
        totalVotes,
        candidates: candidateStats
      };
    }
    
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// NEW: Toggle candidate rigging flag
const toggleCandidateRigging = async (req, res) => {
  try {
    const { candidateId, isRigged } = req.body;
    
    // Validate inputs
    if (!candidateId) {
      return res.status(400).json({
        status: 'error',
        message: 'Candidate ID is required'
      });
    }
    
    // Find and update the candidate
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { isRigged },
      { new: true, runValidators: true }
    );
    
    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `Candidate rigging ${isRigged ? 'activated' : 'deactivated'}`,
      data: {
        candidate: {
          id: candidate._id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          isRigged: candidate.isRigged
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during candidate rigging toggle'
    });
  }
};

// NEW: Get rigged candidates
const getRiggedCandidates = async (req, res) => {
  try {
    // Find all rigged candidates
    const riggedCandidates = await Candidate.find({ isRigged: true });
    
    res.status(200).json({
      status: 'success',
      data: {
        riggedCandidates: riggedCandidates.map(candidate => ({
          id: candidate._id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          position: candidate.position
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error retrieving rigged candidates'
    });
  }
};

module.exports = { getVoters, getVoteStats, toggleCandidateRigging, getRiggedCandidates };