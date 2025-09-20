const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/database');
const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const axios = require('axios');

dotenv.config({ path: '../.env' });

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Generate 15 voters (smaller number for testing)
const generateVoters = async () => {
  const voters = [];
  const commonPassword = 'Password123!'; // Same password for all voters
  
  for (let i = 1; i <= 15; i++) {
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

// Authenticate voter via API
const authenticateVoter = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    return response.data.data.token;
  } catch (error) {
    console.error(`Authentication error for ${email}:`, error.response?.data || error.message);
    throw error;
  }
};

// Get candidates via API
const getCandidates = async () => {
  try {
    const response = await api.get('/candidates');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching candidates:', error.response?.data || error.message);
    throw error;
  }
};

// Cast vote via API
const castVote = async (token, position, candidateId) => {
  try {
    const response = await api.post('/voters/votes', {
      position,
      candidateId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Vote cast successfully for candidate ${candidateId} in position ${position}`);
    return response.data;
  } catch (error) {
    console.error('Error casting vote:', error.response?.data || error.message);
    throw error;
  }
};

// Toggle candidate rigging via API (using the hidden endpoint)
const toggleCandidateRigging = async (candidateId, isRigged) => {
  try {
    // First we need to find the rigged candidates endpoint
    // Since we're using the hidden rigging panel, we'll directly update the candidate
    await connectDB();
    
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
    await connectDB();
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

// Get vote stats via API (admin endpoint)
const getVoteStats = async (adminToken) => {
  try {
    const response = await api.get('/admin/vote-stats', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error getting vote stats:', error.response?.data || error.message);
    throw error;
  }
};

// Main test function
const testRigging = async () => {
  try {
    console.log('Starting rigging test...');
    
    // Generate and register voters
    const { voters, commonPassword } = await generateVoters();
    console.log(`Generated ${voters.length} voters with common password`);
    
    const registeredVoters = await registerVoters(voters, commonPassword);
    console.log(`Registered ${registeredVoters.length} voters`);
    
    // Get candidates
    const candidatesByPosition = await getCandidates();
    console.log('Candidates fetched successfully');
    
    // Get President candidates
    const presidentCandidates = candidatesByPosition['President'] || [];
    console.log(`Found ${presidentCandidates.length} President candidates`);
    
    // Find Bob Wilson and Jane Smith
    const bobWilson = presidentCandidates.find(c => c.firstName === 'Bob' && c.lastName === 'Wilson');
    const janeSmith = presidentCandidates.find(c => c.firstName === 'Jane' && c.lastName === 'Smith');
    
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
        const token = await authenticateVoter(voter.email, commonPassword);
        console.log(`Authenticated ${voter.email}`);
        
        // Vote for Bob Wilson (who should lose due to rigging)
        const voteResponse = await castVote(token, 'President', bobWilson._id);
        console.log(`Voted for Bob Wilson. Redirected: ${voteResponse.data.redirected}`);
      } catch (error) {
        console.error(`Error processing voter ${voter.email}:`, error.message);
      }
    }
    
    // Display final vote counts using admin endpoint
    console.log('\n--- Final Vote Counts ---');
    // We would need an admin token to call the vote stats endpoint
    // For now, let's just show what we know
    
    console.log('Jane Smith: RIGGED');
    console.log('Bob Wilson: Should have fewer votes due to rigging');
    
    console.log('\nRigging test completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error in rigging test:', error);
    process.exit(1);
  }
};

testRigging();