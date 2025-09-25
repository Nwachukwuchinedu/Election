const Election = require("../models/Election");
const ElectionLog = require("../models/ElectionLog");
const { autoGenerateAndSendResults } = require("./resultsController");

// Ensure there is a singleton election document
async function ensureElection() {
  let election = await Election.findOne();
  if (!election) {
    election = new Election({});
    await election.save();
  }
  return election;
}

exports.getStatus = async (req, res) => {
  try {
    const election = await ensureElection();
    res.status(200).json({
      status: "success",
      election,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.startElection = async (req, res) => {
  try {
    const { startTime, endTime } = req.body || {};
    const election = await ensureElection();
    election.status = "ongoing";

    // Handle timezone properly by ensuring dates are treated as local time
    if (startTime) {
      // Parse the date string and ensure it's treated as local time
      const startDateTime = new Date(startTime);
      // If the date has timezone info, we need to adjust it to local time
      if (
        startTime.includes("T") &&
        (startTime.includes("+") || startTime.includes("Z"))
      ) {
        // If it's already in ISO format with timezone, we'll use it as is
        election.startTime = startDateTime;
      } else {
        // If it's a simple date string, treat it as local time
        election.startTime = startDateTime;
      }
    } else {
      election.startTime = new Date();
    }

    if (endTime) {
      // Parse the date string and ensure it's treated as local time
      const endDateTime = new Date(endTime);
      // If the date has timezone info, we need to adjust it to local time
      if (
        endTime.includes("T") &&
        (endTime.includes("+") || endTime.includes("Z"))
      ) {
        // If it's already in ISO format with timezone, we'll use it as is
        election.endTime = endDateTime;
      } else {
        // If it's a simple date string, treat it as local time
        election.endTime = endDateTime;
      }
    }

    await election.save();

    await ElectionLog.create({
      electionId: election._id,
      action: "started",
      details: "Election started",
      userId: req.user?._id,
      userName: req.user
        ? `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim()
        : "System",
    });

    // Emit socket update
    try {
      const io = req.app.get("io");
      io && io.emit("electionStatusUpdate", election);
    } catch (_) {}

    res.status(200).json({ status: "success", election });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["not_started", "ongoing", "paused", "completed"];
    if (!valid.includes(status)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid status" });
    }
    const election = await ensureElection();
    election.status = status;
    if (status === "paused") {
      election.pausedAt = new Date();
    }
    if (status === "completed") {
      election.endTime = new Date();
    }
    await election.save();

    await ElectionLog.create({
      electionId: election._id,
      action:
        status === "ongoing"
          ? "resumed"
          : status === "paused"
          ? "paused"
          : "completed",
      details: `Election ${status}`,
      userId: req.user?._id,
      userName: req.user
        ? `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim()
        : "System",
    });

    // If completed, generate and email results
    if (status === "completed") {
      try {
        await autoGenerateAndSendResults(election._id);
      } catch (err) {
        console.error("Error auto-generating results on completion:", err);
      }
    }

    // Emit socket update
    try {
      const io = req.app.get("io");
      io && io.emit("electionStatusUpdate", election);
    } catch (_) {}

    res.status(200).json({ status: "success", election });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const { electionId } = req.params;
    const query = electionId && electionId !== "all" ? { electionId } : {};
    const logs = await ElectionLog.find(query)
      .sort({ timestamp: -1 })
      .limit(200);
    res.status(200).json({ status: "success", logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.generateResults = async (req, res) => {
  try {
    const election = await ensureElection();
    const result = await autoGenerateAndSendResults(election._id);
    await ElectionLog.create({
      electionId: election._id,
      action: "completed",
      details: "Results generated and emailed",
      userId: req.user?._id,
      userName: req.user
        ? `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim()
        : "System",
    });
    res
      .status(200)
      .json({
        status: "success",
        message: "Results generated",
        data: {
          emailInfo: result?.emailInfo
            ? { messageId: result.emailInfo.messageId }
            : null,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// Periodic status checker used by app.js
exports.checkElectionStatuses = async (io) => {
  try {
    const election = await Election.findOne();
    if (!election) return;

    let changed = false;
    const now = Date.now();

    if (
      election.status === "not_started" &&
      election.startTime &&
      election.startTime.getTime() <= now
    ) {
      election.status = "ongoing";
      changed = true;
    }

    if (
      election.status === "ongoing" &&
      election.endTime &&
      election.endTime.getTime() <= now
    ) {
      election.status = "completed";
      changed = true;
      try {
        await autoGenerateAndSendResults(election._id);
      } catch (err) {
        console.error("Error auto-generating results in checker:", err);
      }
    }

    if (changed) {
      await election.save();
      io && io.emit("electionStatusUpdate", election);
    }
  } catch (error) {
    console.error("checkElectionStatuses error:", error);
  }
};

// Removing duplicated legacy controller implementation below to avoid redeclarations
