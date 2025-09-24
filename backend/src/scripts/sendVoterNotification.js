const mongoose = require("mongoose");
const Voter = require("../models/Voter");
const nodemailer = require("nodemailer");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

// Log environment variables for debugging (without exposing sensitive data)
console.log("📧 Email Configuration Check:");
console.log("Current working directory:", process.cwd());
console.log("__dirname:", __dirname);
console.log("Dotenv path:", require("path").resolve(__dirname, "../../.env"));
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
            <p><strong>Important Information:</strong></p>
            <ul>
              <li>You will receive your login credentials in a separate email</li>
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
  batchSize = 5,
  initialDelayMs = 5000,
  maxTotalTimeMs = 600000
) => {
  const results = [];
  let currentDelay = initialDelayMs;
  const numberOfBatches = Math.ceil(voters.length / batchSize);

  // Calculate target delay to fit within total time
  // This is a simplified approach - for exact timing we'd need more complex calculations
  const targetTotalDelay = maxTotalTimeMs - numberOfBatches * 2000; // Reserve 2 seconds per batch for processing
  const baseMultiplier = Math.pow(2, 1 / (numberOfBatches - 1)); // Calculate multiplier for exponential growth
  const adjustedMultiplier = Math.min(baseMultiplier, 1.3); // Cap the multiplier to prevent too rapid growth

  for (let i = 0; i < voters.length; i += batchSize) {
    const batch = voters.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(voters.length / batchSize);

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

      // Increase delay exponentially for next batch (but more gradually to fit in 10 minutes)
      currentDelay = Math.min(currentDelay * adjustedMultiplier, 30000); // Max 30 seconds delay
    }
  }

  return results;
};

// Main function to send notifications to all voters
const sendVoterNotifications = async () => {
  try {
    console.log("🚀 Starting voter notification process...");

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

    // Fetch all voters from the database
    const voters = await Voter.find({});
    console.log(`📊 Found ${voters.length} voters in the database`);

    if (voters.length === 0) {
      console.log("⚠️ No voters found in the database");
      process.exit(0);
    }

    // Calculate timing information
    const totalEmails = voters.length;
    const batchSize = 5;
    const numberOfBatches = Math.ceil(totalEmails / batchSize);
    const totalTimeMinutes = 10;
    const totalTimeMs = totalTimeMinutes * 60 * 1000;

    console.log(`\n⏰ Exponential Backoff Configuration (10-minute target):`);
    console.log(`   Total emails: ${totalEmails}`);
    console.log(`   Batch size: ${batchSize}`);
    console.log(`   Number of batches: ${numberOfBatches}`);
    console.log(`   Target completion time: ${totalTimeMinutes} minutes`);
    console.log(`   Initial delay: 3 seconds`);
    console.log(`   Backoff multiplier: Adjusted to fit 10-minute window`);
    console.log(`   Maximum delay: 30 seconds`);

    // Send emails in batches with exponential backoff designed for 10-minute completion
    const results = await sendEmailsInBatches(
      voters,
      batchSize,
      3000,
      totalTimeMs
    );

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
  sendVoterNotifications,
};

// Run the notification process if this file is executed directly
if (require.main === module) {
  sendVoterNotifications();
}
