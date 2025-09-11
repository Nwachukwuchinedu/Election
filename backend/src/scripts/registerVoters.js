const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/database');
const Voter = require('../models/Voter');
const { sendCredentialsEmail } = require('../services/emailService');

dotenv.config({ path: '../.env' });

// Sample voter data - in a real application, this would come from a CSV file
const votersData = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    matricNumber: 'ENG1234',
    level: 300
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    matricNumber: 'ENG5678',
    level: 200
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    matricNumber: 'ENG9012',
    level: 400
  }
];

const registerVoters = async () => {
  try {
    await connectDB();
    
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
        continue;
      }
      
      // Generate random password
      const password = Math.random().toString(36).slice(-8);
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create voter
      const voter = new Voter({
        ...voterData,
        password: hashedPassword
      });
      
      await voter.save();
      
      // Send credentials email (commented out for development)
      // await sendCredentialsEmail(voterData.email, voterData.firstName, voterData.lastName, password);
      
      console.log(`Voter ${voterData.email} registered successfully with password: ${password}`);
    }
    
    console.log('All voters registered successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error registering voters:', error);
    process.exit(1);
  }
};

registerVoters();