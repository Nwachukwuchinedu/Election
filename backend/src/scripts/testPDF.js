const fs = require('fs');
const path = require('path');
const { generateElectionResultsPDF } = require('../controllers/resultsController');
const connectDB = require('../config/database');
const Election = require('../models/Election');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to database
connectDB();

// Test PDF generation
const testPDFGeneration = async () => {
  try {
    console.log('Testing PDF generation...');
    
    // Get the most recent election
    const election = await Election.findOne().sort({ createdAt: -1 });
    
    if (!election) {
      console.log('No election found. Creating a test election...');
      
      // Create a test election
      const testElection = new Election({
        name: 'Test Election',
        status: 'completed',
        startTime: new Date(Date.now() - 86400000), // 24 hours ago
        endTime: new Date()
      });
      
      await testElection.save();
      console.log('Test election created:', testElection._id);
    }
    
    // Get the election again
    const latestElection = await Election.findOne().sort({ createdAt: -1 });
    console.log('Generating PDF for election:', latestElection._id);
    
    // Generate PDF
    const pdfBuffer = await generateElectionResultsPDF(latestElection._id);
    
    // Save to file
    const outputPath = path.join(__dirname, 'test-election-results.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log('PDF generated successfully!');
    console.log('Output saved to:', outputPath);
    
    process.exit(0);
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
};

testPDFGeneration();