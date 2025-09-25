const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const Candidate = require("../models/Candidate");
const Vote = require("../models/Vote");
const Election = require("../models/Election");
const ElectionLog = require("../models/ElectionLog");

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to generate election results PDF
const generateElectionResultsPDF = async (electionId) => {
  try {
    // Get election details
    const election = await Election.findById(electionId);
    if (!election) {
      throw new Error("Election not found");
    }

    // Get all positions
    const positions = await Candidate.distinct("position");

    // For each position, get vote statistics
    const results = {};
    let totalVotes = 0;

    for (const position of positions) {
      // Get total votes for this position
      const positionTotalVotes = await Vote.countDocuments({ position });
      totalVotes += positionTotalVotes;

      // Get candidates for this position
      const candidates = await Candidate.find({ position });

      // For each candidate, count their votes
      const candidateStats = await Promise.all(
        candidates.map(async (candidate) => {
          const votes = await Vote.countDocuments({
            position,
            candidateId: candidate._id,
          });

          return {
            _id: candidate._id,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            position: candidate.position,
            voteCount: votes,
          };
        })
      );

      // Sort candidates by vote count (descending)
      candidateStats.sort((a, b) => b.voteCount - a.voteCount);

      results[position] = {
        totalVotes: positionTotalVotes,
        candidates: candidateStats,
      };
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {});

    // Add header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("OFFICIAL ELECTION RESULTS", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(16)
      .font("Helvetica")
      .text(`Election: ${election.name || "General Election"}`, {
        align: "center",
      });

    doc.moveDown();

    const electionDate = election.endTime
      ? new Date(election.endTime).toLocaleDateString()
      : new Date().toLocaleDateString();
    doc.fontSize(12).text(`Date: ${electionDate}`, { align: "center" });

    doc.moveDown(2);

    // Add summary statistics
    doc.fontSize(14).font("Helvetica-Bold").text("SUMMARY STATISTICS");

    doc.moveDown();

    doc.fontSize(12).font("Helvetica").text(`Total Votes Cast: ${totalVotes}`);

    doc.moveDown();

    // Add results by position
    for (const [position, data] of Object.entries(results)) {
      doc.addPage();

      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(position, { underline: true });

      doc.moveDown();

      doc
        .fontSize(12)
        .font("Helvetica")
        .text(`Total Votes: ${data.totalVotes}`);

      doc.moveDown();

      // Create table header
      const tableTop = doc.y;
      const rowHeight = 20;
      const nameWidth = 200;
      const votesWidth = 100;
      const percentageWidth = 100;

      doc
        .font("Helvetica-Bold")
        .text("Candidate", 50, tableTop)
        .text("Votes", 50 + nameWidth, tableTop)
        .text("Percentage", 50 + nameWidth + votesWidth, tableTop);

      // Draw header line
      doc
        .moveTo(50, tableTop + 15)
        .lineTo(50 + nameWidth + votesWidth + percentageWidth, tableTop + 15)
        .stroke();

      let yPosition = tableTop + 25;

      // Add candidate rows
      doc.font("Helvetica");

      data.candidates.forEach((candidate, index) => {
        const percentage =
          data.totalVotes > 0
            ? ((candidate.voteCount / data.totalVotes) * 100).toFixed(2)
            : "0.00";

        doc
          .text(`${candidate.firstName} ${candidate.lastName}`, 50, yPosition)
          .text(candidate.voteCount.toString(), 50 + nameWidth, yPosition)
          .text(`${percentage}%`, 50 + nameWidth + votesWidth, yPosition);

        yPosition += rowHeight;

        // Add winner indicator for first place
        if (index === 0 && candidate.voteCount > 0) {
          doc
            .fontSize(10)
            .text(
              "WINNER",
              50 + nameWidth + votesWidth + percentageWidth + 10,
              yPosition - rowHeight + 5
            )
            .fontSize(12);
        }
      });
    }

    // Add footer
    doc.addPage();

    doc
      .fontSize(12)
      .font("Helvetica")
      .text("This document represents the official results of the election.", {
        align: "center",
      });

    doc.moveDown();

    doc.fontSize(10).text("Generated automatically by the Election System", {
      align: "center",
    });

    doc.moveDown();

    const generatedDate = new Date().toLocaleString();
    doc.text(`Generated on: ${generatedDate}`, { align: "center" });

    // Finalize PDF
    doc.end();

    // Wait for PDF to be generated
    const pdfBuffer = await new Promise((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// Function to send election results via email
const sendElectionResultsEmail = async (pdfBuffer, election) => {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Email addresses to send results to (from environment variables)
      const recipientEmails = [
        process.env.RESULTS_EMAIL_1 || "osemudiamenmonday2@gmail.com",
        process.env.RESULTS_EMAIL_2 || "owieosayimwense@gmail.com",
        process.env.RESULTS_EMAIL_3 || "osemudiamenmonday2@gmail.com",
        //process.env.RESULTS_EMAIL_4
      ].filter((email) => email && email !== "admin@example.com"); // Filter out default values

      // Get election logs for additional information
      const logs = await ElectionLog.find({ electionId: election._id })
        .sort({ timestamp: -1 })
        .limit(20);

      // Create email content
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: recipientEmails.join(", "),
        subject: `Election Results - ${election.name || "General Election"}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Official Election Results</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #34495e; margin-top: 0;">Election Details</h3>
            <p><strong>Election:</strong> ${
              election.name || "General Election"
            }</p>
            <p><strong>Status:</strong> ${election.status}</p>
            <p><strong>Start Time:</strong> ${
              election.startTime
                ? new Date(election.startTime).toLocaleString()
                : "N/A"
            }</p>
            <p><strong>End Time:</strong> ${
              election.endTime
                ? new Date(election.endTime).toLocaleString()
                : "N/A"
            }</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #34495e;">Recent Election Activity</h3>
            <ul style="list-style-type: none; padding: 0;">
              ${logs
                .map(
                  (log) => `
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                  <strong>${new Date(
                    log.timestamp
                  ).toLocaleString()}</strong> - 
                  <span style="color: #e74c3c;">${log.action}</span> - 
                  ${log.details || "N/A"}
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
          
          <div style="background-color: #e8f4fc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p>Please find the detailed results attached as a PDF document.</p>
            <p><strong>Note:</strong> This email contains confidential election results. Please handle appropriately.</p>
          </div>
          
          <div style="text-align: center; color: #7f8c8d; font-size: 12px; margin-top: 30px;">
            <p>Generated automatically by the Election System</p>
            <p>© ${new Date().getFullYear()} Election System. All rights reserved.</p>
          </div>
        </div>
      `,
        attachments: [
          {
            filename: `election-results-${
              new Date().toISOString().split("T")[0]
            }.pdf`,
            content: pdfBuffer,
          },
        ],
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log("Election results email sent:", info.messageId);

      return info;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      lastError = error;

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  if (lastError) {
    console.error("All retry attempts failed. Last error:", lastError);
    throw lastError;
  }

  return null; // This line will never be reached but satisfies TypeScript
};

// Function to automatically generate and send results when election completes
const autoGenerateAndSendResults = async (electionId) => {
  try {
    const election = await Election.findById(electionId);
    if (!election) {
      throw new Error("Election not found");
    }

    // Generate PDF
    const pdfBuffer = await generateElectionResultsPDF(electionId);

    // Send email
    const emailInfo = await sendElectionResultsEmail(pdfBuffer, election);

    console.log("Election results automatically generated and sent");
    return { pdfBuffer, emailInfo };
  } catch (error) {
    console.error("Error in autoGenerateAndSendResults:", error);
    throw error;
  }
};

module.exports = {
  generateElectionResultsPDF,
  sendElectionResultsEmail,
  autoGenerateAndSendResults,
};
