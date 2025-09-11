const dotenv = require('dotenv');
const connectDB = require('../config/database');
const Candidate = require('../models/Candidate');
const { uploadImage } = require('../services/cloudinaryService');

dotenv.config({ path: '../.env' });

// Sample candidate data - in a real application, this would come from a CSV file
const candidatesData = [
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    position: 'President',
    profilePictureUrl: 'https://via.placeholder.com/300x300.png?text=Jane+Smith'
  },
  {
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.wilson@example.com',
    position: 'President',
    profilePictureUrl: 'https://via.placeholder.com/300x300.png?text=Bob+Wilson'
  },
  {
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.brown@example.com',
    position: 'Vice President',
    profilePictureUrl: 'https://via.placeholder.com/300x300.png?text=Alice+Brown'
  },
  {
    firstName: 'Charlie',
    lastName: 'Davis',
    email: 'charlie.davis@example.com',
    position: 'Vice President',
    profilePictureUrl: 'https://via.placeholder.com/300x300.png?text=Charlie+Davis'
  }
];

const registerCandidates = async () => {
  try {
    await connectDB();
    
    for (const candidateData of candidatesData) {
      // Check if candidate already exists
      const existingCandidate = await Candidate.findOne({ email: candidateData.email });
      
      if (existingCandidate) {
        console.log(`Candidate ${candidateData.email} already exists`);
        continue;
      }
      
      // Create candidate
      const candidate = new Candidate(candidateData);
      await candidate.save();
      
      console.log(`Candidate ${candidateData.email} registered successfully`);
    }
    
    console.log('All candidates registered successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error registering candidates:', error);
    process.exit(1);
  }
};

registerCandidates();