const mongoose = require("mongoose");
const Voter = require("../models/Voter");
const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

// Log environment variables for debugging (without exposing sensitive data)
console.log("📧 Email Configuration Check:");
console.log("Current working directory:", process.cwd());
console.log("__dirname:", __dirname);
console.log("SMTP_HOST:", process.env.SMTP_HOST || "Not set, using default");
console.log("SMTP_PORT:", process.env.SMTP_PORT || "Not set, using default");
console.log(
  "SMTP_USER:",
  process.env.SMTP_USER ? "Set (hidden for security)" : "Not set"
);
console.log("SMTP_FROM:", process.env.SMTP_FROM || "Not set, using default");

// MongoDB connection
mongoose.connect(
  "mongodb+srv://chinedusimeon2020:YhD4qCOdBH2JDUhC@speunibenvoting.hyxvh.mongodb.net/?retryWrites=true&w=majority&appName=speunibenvoting"
);

// Email transporter configuration (using the same approach as emailService.js)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com", // Default to Gmail
  port: process.env.SMTP_PORT || 587, // Default to Gmail port
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send email to a single voter
const sendEmailToVoter = async (voter) => {
  try {
    // Skip if no email configuration is set
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(
        `⚠️  Email not configured. Skipping ${voter.firstName} ${voter.lastName} (${voter.email})`
      );
      return { success: false, voter, error: "Email not configured" };
    }

    // Generate a 6-character alphanumeric random password
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 6; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update voter with hashed password
    voter.password = hashedPassword;
    await voter.save();

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: voter.email,
      subject: "Election System - Voting Eligibility Notification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Election System Notification</h2>
          <p>Hello <strong>${voter.firstName} ${voter.lastName}</strong>,</p>
          <p>If you see this message, you are eligible to vote in the upcoming election.</p>
          <p>Please make sure to participate in the voting process when it begins.</p>
          <div style="background-color: #f0f8ff; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <p><strong>Login Credentials:</strong></p>
            <p>Your password is: <strong>${password}</strong></p>
            <p><strong>Important Information:</strong></p>
            <ul>
              <li>Voting will take place during the specified election period</li>
              <li>Make sure to keep your login information secure</li>
            </ul>
          </div>
          <p>Best regards,<br><strong>Election System Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `✅ Email sent successfully to ${voter.firstName} ${voter.lastName} (${voter.email})`
    );
    return { success: true, voter, error: null };
  } catch (error) {
    console.error(
      `❌ Error sending email to ${voter.firstName} ${voter.lastName} (${voter.email}):`,
      error.message
    );
    return { success: false, voter, error: error.message };
  }
};

// Function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to send emails in batches with exponential backoff delay
const sendEmailsInBatches = async (
  voters,
  startIndex,
  batchSize = 2,
  initialDelayMs = 3000
) => {
  const results = [];
  let currentDelay = initialDelayMs;
  const adjustedMultiplier = 1.3; // More gradual increase

  for (let i = startIndex; i < voters.length; i += batchSize) {
    const batch = voters.slice(i, i + batchSize);
    const batchNumber = Math.floor((i - startIndex) / batchSize) + 1;
    const totalBatches = Math.ceil((voters.length - startIndex) / batchSize);

    console.log(
      `\n📧 Sending batch ${batchNumber}/${totalBatches} (${batch.length} emails)`
    );

    // Send all emails in the current batch in parallel
    const batchResults = await Promise.all(
      batch.map((voter) => sendEmailToVoter(voter))
    );
    results.push(...batchResults);

    // Add exponential backoff delay between batches (except for the last batch)
    if (i + batchSize < voters.length) {
      console.log(
        `⏳ Waiting ${Math.round(
          currentDelay / 1000
        )} seconds before sending next batch...`
      );
      await delay(currentDelay);

      // Increase delay exponentially for next batch (but more gradually)
      currentDelay = Math.min(currentDelay * adjustedMultiplier, 30000); // Max 30 seconds delay
    }
  }

  return results;
};

// Main function to send notifications to remaining voters
const sendRemainingVoterNotifications = async (startEmail = null) => {
  try {
    console.log("🚀 Starting remaining voter notification process...");

    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("❌ Email configuration is missing!");
      console.log(
        "📝 Please set the following environment variables in your .env file:"
      );
      console.log("   SMTP_HOST=smtp.gmail.com");
      console.log("   SMTP_PORT=587");
      console.log("   SMTP_USER=your-email@gmail.com");
      console.log("   SMTP_PASS=your-app-password");
      console.log("   SMTP_FROM=your-email@gmail.com");
      console.log("\n💡 For Gmail, you need to generate an App Password:");
      console.log("   1. Go to your Google Account settings");
      console.log(
        "   2. Navigate to Security > 2-Step Verification > App passwords"
      );
      console.log("   3. Generate a new app password for 'Mail'");
      process.exit(1);
    }

    // Fetch all voters from the database, maintaining consistent order
    const voters = await Voter.find({}).sort({ _id: 1 }); // Sort by _id to maintain consistent order
    console.log(`📊 Found ${voters.length} voters in the database`);

    if (voters.length === 0) {
      console.log("⚠️ No voters found in the database");
      process.exit(0);
    }

    // Determine starting index
    let startIndex = 0;
    if (startEmail) {
      const startIndexInArray = voters.findIndex(
        (voter) => voter.email === startEmail
      );
      if (startIndexInArray === -1) {
        console.log(`❌ Could not find voter with email: ${startEmail}`);
        console.log("⚠️ Starting from the beginning of the list");
        startIndex = 0;
      } else {
        console.log(`✅ Found starting email at index: ${startIndexInArray}`);
        startIndex = startIndexInArray;
      }
    }

    // Get remaining voters
    const remainingVoters = voters.slice(startIndex);
    console.log(`📋 ${remainingVoters.length} voters remaining to be notified`);

    if (remainingVoters.length === 0) {
      console.log("✅ All voters have already been notified!");
      process.exit(0);
    }

    console.log(`\n⏰ Exponential Backoff Configuration (10-minute target):`);
    console.log(`   Total remaining emails: ${remainingVoters.length}`);
    console.log(`   Batch size: 5`);
    console.log(
      `   Number of batches: ${Math.ceil(remainingVoters.length / 5)}`
    );
    console.log(`   Initial delay: 3 seconds`);
    console.log(`   Backoff multiplier: 1.3x`);
    console.log(`   Maximum delay: 30 seconds`);

    // Send emails in batches with exponential backoff, starting from the specified index
    const results = await sendEmailsInBatches(voters, startIndex, 5, 3000);

    // Calculate statistics
    const successfulSends = results.filter((result) => result.success).length;
    const failedSends = results.filter((result) => !result.success).length;

    console.log(`\n📈 Email sending completed!`);
    console.log(`✅ Successful: ${successfulSends}`);
    console.log(`❌ Failed: ${failedSends}`);

    // Log failed attempts
    if (failedSends > 0) {
      console.log(`\n📝 Failed email attempts:`);
      results
        .filter((result) => !result.success)
        .forEach((result) => {
          console.log(
            `  - ${result.voter.firstName} ${result.voter.lastName} (${result.voter.email}): ${result.error}`
          );
        });
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error in voter notification process:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Export functions for testing
module.exports = {
  sendEmailToVoter,
  sendEmailsInBatches,
  sendRemainingVoterNotifications,
};

// Run the notification process if this file is executed directly
if (require.main === module) {
  // Check if a starting email was provided as a command line argument
  const startEmail = process.argv[2];
  if (startEmail) {
    console.log(`🔄 Starting from email: ${startEmail}`);
    sendRemainingVoterNotifications(startEmail);
  } else {
    console.log("🔄 Starting from the beginning of the voter list");
    sendRemainingVoterNotifications();
  }
}
