const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/database');
const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const jwt = require('jsonwebtoken');

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Generate 20 voters
const generateVoters = async () => {
  const voters = [];
  const commonPassword = 'Password123!'; // Same password for all voters
  
  for (let i = 1; i <= 20; i++) {
    voters.push({
      firstName: `Voter${i}`,
      lastName: `LastName${i}`,
      email: `voter${i}@example.com`,
      matricNumber: `MAT${1000 + i}`,
      level: 300
    });
  }
  
  return { voters, commonPassword };
};

// Register voters
const registerVoters = async (votersData, password) => {
  try {
    await connectDB();
    
    const registeredVoters = [];
    
    for (const voterData of votersData) {
      // Check if voter already exists
      const existingVoter = await Voter.findOne({ 
        $or: [
          { email: voterData.email },
          { matricNumber: voterData.matricNumber }
        ]
      });
      
      if (existingVoter) {
        console.log(`Voter ${voterData.email} already exists`);
        registeredVoters.push(existingVoter);
        continue;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create voter
      const voter = new Voter({
        ...voterData,
        password: hashedPassword
      });
      
      await voter.save();
      registeredVoters.push(voter);
      
      console.log(`Voter ${voterData.email} registered successfully`);
    }
    
    return registeredVoters;
  } catch (error) {
    console.error('Error registering voters:', error);
    throw error;
  }
};

// Authenticate voter
const authenticateVoter = async (email, password) => {
  try {
    const voter = await Voter.findOne({ email });
    if (!voter) {
      throw new Error('Voter not found');
    }
    
    const isMatch = await bcrypt.compare(password, voter.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: voter._id, role: 'voter' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return { token, voter };
  } catch (error) {
    console.error(`Authentication error for ${email}:`, error.message);
    throw error;
  }
};

// Get candidates
const getCandidates = async () => {
  try {
    const candidates = await Candidate.find({});
    return candidates;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

// Cast vote
const castVote = async (token, position, candidateId) => {
  try {
    // Simulate the vote casting API call
    // In a real scenario, this would be an HTTP request to the backend
    const vote = new Vote({
      voterId: jwt.verify(token, process.env.JWT_SECRET).id,
      position,
      candidateId
    });
    
    await vote.save();
    
    // Update voter's hasVoted array
    const voterId = jwt.verify(token, process.env.JWT_SECRET).id;
    const voter = await Voter.findById(voterId);
    if (!voter.hasVoted.includes(position)) {
      voter.hasVoted.push(position);
      await voter.save();
    }
    
    console.log(`Vote cast successfully for candidate ${candidateId} in position ${position}`);
    return vote;
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
};

// Toggle candidate rigging
const toggleCandidateRigging = async (candidateId, isRigged) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { isRigged },
      { new: true, runValidators: true }
    );
    
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    
    console.log(`Candidate rigging ${isRigged ? 'activated' : 'deactivated'} for ${candidate.firstName} ${candidate.lastName}`);
    return candidate;
  } catch (error) {
    console.error('Error toggling candidate rigging:', error);
    throw error;
  }
};

// Get vote counts
const getVoteCounts = async () => {
  try {
    const candidates = await Candidate.find({});
    const voteCounts = {};
    
    for (const candidate of candidates) {
      const votes = await Vote.countDocuments({
        candidateId: candidate._id
      });
      voteCounts[candidate._id] = {
        name: `${candidate.firstName} ${candidate.lastName}`,
        votes: votes,
        isRigged: candidate.isRigged
      };
    }
    
    return voteCounts;
  } catch (error) {
    console.error('Error getting vote counts:', error);
    throw error;
  }
};

// Main simulation function
const simulateVoting = async () => {
  try {
    console.log('Starting voting simulation...');
    
    // Generate and register voters
    const { voters, commonPassword } = await generateVoters();
    console.log(`Generated ${voters.length} voters with common password`);
    
    const registeredVoters = await registerVoters(voters, commonPassword);
    console.log(`Registered ${registeredVoters.length} voters`);
    
    // Get candidates
    const candidates = await getCandidates();
    console.log(`Found ${candidates.length} candidates`);
    
    // Find Bob Wilson and Jane Smith
    const bobWilson = candidates.find(c => c.firstName === 'Bob' && c.lastName === 'Wilson');
    const janeSmith = candidates.find(c => c.firstName === 'Jane' && c.lastName === 'Smith');
    
    if (!bobWilson || !janeSmith) {
      throw new Error('Could not find Bob Wilson or Jane Smith candidates');
    }
    
    console.log(`Bob Wilson ID: ${bobWilson._id}`);
    console.log(`Jane Smith ID: ${janeSmith._id}`);
    
    // Rig Jane Smith to win
    await toggleCandidateRigging(janeSmith._id, true);
    console.log('Jane Smith has been rigged to win');
    
    // Simulate each voter logging in and voting for Bob Wilson
    for (let i = 0; i < registeredVoters.length; i++) {
      const voter = registeredVoters[i];
      console.log(`\n--- Processing Voter ${i + 1}: ${voter.email} ---`);
      
      try {
        // Authenticate voter
        const { token } = await authenticateVoter(voter.email, commonPassword);
        console.log(`Authenticated ${voter.email}`);
        
        // Vote for Bob Wilson (who should lose due to rigging)
        await castVote(token, 'President', bobWilson._id);
        console.log(`Voted for Bob Wilson`);
      } catch (error) {
        console.error(`Error processing voter ${voter.email}:`, error.message);
      }
    }
    
    // Display final vote counts
    console.log('\n--- Final Vote Counts ---');
    const voteCounts = await getVoteCounts();
    for (const [candidateId, data] of Object.entries(voteCounts)) {
      console.log(`${data.name}: ${data.votes} votes ${data.isRigged ? '(RIGGED)' : ''}`);
    }
    
    console.log('\nVoting simulation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error in voting simulation:', error);
    process.exit(1);
  }
};

simulateVoting();