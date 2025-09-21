const Election = require('../models/Election');
const ElectionLog = require('../models/ElectionLog'); // Add ElectionLog model
const { autoGenerateAndSendResults } = require('./resultsController'); // Add results controller

// Function to extract device information from request
const getDeviceInfo = (req) => {
  return {
    userAgent: req.get('User-Agent') || '',
    platform: req.get('User-Agent') ? req.get('User-Agent').match(/\(([^)]+)\)/)?.[1] || '' : '',
    browser: req.get('User-Agent') ? req.get('User-Agent').split(' ')[0] || '' : '',
    ip: req.ip || req.connection.remoteAddress || ''
  };
};

// Function to check and update election statuses
const checkElectionStatuses = async (io) => {
  try {
    const now = new Date();
    const election = await Election.findOne().sort({ createdAt: -1 });
    
    if (!election) return;
    
    let statusUpdated = false;
    let updatedElection = { ...election._doc };
    
    // Check if a scheduled election should start
    if (election.status === 'not_started' && election.startTime && now >= election.startTime) {
      election.status = 'ongoing';
      election.updatedAt = now;
      await election.save();
      statusUpdated = true;
      updatedElection = { ...election._doc };
      
      // Log the start
      const log = new ElectionLog({
        electionId: election._id,
        action: 'started',
        details: 'Election automatically started as start time was reached',
        userId: null,
        userName: 'System',
        deviceInfo: {
          userAgent: 'System Scheduler',
          platform: 'Server',
          browser: 'Node.js',
          ip: 'localhost'
        }
      });
      await log.save();
    }
    
    // Check if an ongoing election should be completed
    if (election.status === 'ongoing' && election.endTime && now >= election.endTime) {
      election.status = 'completed';
      election.updatedAt = now;
      await election.save();
      statusUpdated = true;
      updatedElection = { ...election._doc };
      
      // Log the completion
      const log = new ElectionLog({
        electionId: election._id,
        action: 'completed',
        details: 'Election automatically completed as end time was reached',
        userId: null,
        userName: 'System',
        deviceInfo: {
          userAgent: 'System Scheduler',
          platform: 'Server',
          browser: 'Node.js',
          ip: 'localhost'
        }
      });
      await log.save();
      
      // Automatically generate and send results
      try {
        await autoGenerateAndSendResults(election._id);
      } catch (error) {
        console.error('Error auto-generating election results:', error);
      }
    }
    
    // Emit update if status changed
    if (statusUpdated && io) {
      io.emit('electionStatusUpdate', {
        id: updatedElection._id,
        name: updatedElection.name,
        status: updatedElection.status,
        startTime: updatedElection.startTime,
        endTime: updatedElection.endTime,
        pausedAt: updatedElection.pausedAt,
        pausedDuration: updatedElection.pausedDuration
      });
    }
  } catch (error) {
    console.error('Error checking election statuses:', error);
  }
};

// Get current election status
const getElectionStatus = async (req, res) => {
  try {
    // Get the most recent election record
    let election = await Election.findOne().sort({ createdAt: -1 });
    
    // If no election exists, create a default one
    if (!election) {
      election = new Election({
        name: 'General Election',
        status: 'not_started'
      });
      await election.save();
    }
    
    // Check if election should be completed (end time has passed)
    const now = new Date();
    if (election.status === 'ongoing' && election.endTime && now > election.endTime) {
      // Election should be completed
      election.status = 'completed';
      election.updatedAt = now;
      await election.save();
      
      // Log the completion
      const log = new ElectionLog({
        electionId: election._id,
        action: 'completed',
        details: 'Election automatically completed as end time was reached',
        userId: null,
        userName: 'System',
        deviceInfo: getDeviceInfo(req)
      });
      await log.save();
      
      // Automatically generate and send results
      try {
        await autoGenerateAndSendResults(election._id);
      } catch (error) {
        console.error('Error auto-generating election results:', error);
      }
      
      // Emit election status update event
      const io = req.app.get('io');
      if (io) {
        io.emit('electionStatusUpdate', {
          id: election._id,
          name: election.name,
          status: election.status,
          startTime: election.startTime,
          endTime: election.endTime,
          pausedAt: election.pausedAt,
          pausedDuration: election.pausedDuration
        });
      }
    }
    
    // Calculate remaining time if election is ongoing
    let remainingTime = null;
    if (election.status === 'ongoing' && election.endTime) {
      const pausedDuration = election.pausedDuration || 0;
      const adjustedEndTime = new Date(election.endTime.getTime() + pausedDuration);
      remainingTime = Math.max(0, adjustedEndTime - now);
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        election: {
          id: election._id,
          name: election.name,
          status: election.status,
          startTime: election.startTime,
          endTime: election.endTime,
          pausedAt: election.pausedAt,
          pausedDuration: election.pausedDuration,
          remainingTime: remainingTime
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Get election logs - now fetches logs for all elections
const getElectionLogs = async (req, res) => {
  try {
    const { electionId } = req.params;
    let query = {};
    
    // If electionId is provided, filter by that election
    // Otherwise, fetch all logs
    if (electionId && electionId !== 'all') {
      query.electionId = electionId;
    }
    
    const logs = await ElectionLog.find(query)
      .sort({ timestamp: -1 })
      .limit(500); // Increase limit to show more historical logs
    
    res.status(200).json({
      status: 'success',
      data: {
        logs
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Start election
const startElection = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    
    // Validate input
    if (!startTime || !endTime) {
      return res.status(400).json({
        status: 'error',
        message: 'Start time and end time are required'
      });
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
    
    if (start >= end) {
      return res.status(400).json({
        status: 'error',
        message: 'End time must be after start time'
      });
    }
    
    // Allow scheduling in the future or starting now
    // if (start < now) {
    //   return res.status(400).json({
    //     status: 'error',
    //     message: 'Start time must be in the future'
    //   });
    // }
    
    // Create new election record
    const election = new Election({
      name: 'General Election',
      status: start <= now ? 'ongoing' : 'not_started',
      startTime: start,
      endTime: end
    });
    
    await election.save();
    
    // Log the creation
    const log = new ElectionLog({
      electionId: election._id,
      action: 'created',
      details: `Election scheduled from ${start} to ${end}`,
      userId: req.user ? req.user._id : null,
      userName: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System',
      deviceInfo: getDeviceInfo(req)
    });
    await log.save();
    
    // If starting now, log that too
    if (election.status === 'ongoing') {
      const startLog = new ElectionLog({
        electionId: election._id,
        action: 'started',
        details: 'Election started immediately',
        userId: req.user ? req.user._id : null,
        userName: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System',
        deviceInfo: getDeviceInfo(req)
      });
      await startLog.save();
    }
    
    res.status(201).json({
      status: 'success',
      message: 'Election scheduled successfully',
      data: {
        election
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Update election status (start, pause, resume, end)
const updateElectionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['not_started', 'ongoing', 'paused', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be one of: not_started, ongoing, paused, completed'
      });
    }
    
    // Get the most recent election
    let election = await Election.findOne().sort({ createdAt: -1 });
    
    if (!election) {
      return res.status(404).json({
        status: 'error',
        message: 'No election found'
      });
    }
    
    const now = new Date();
    const oldStatus = election.status;
    
    // Handle status transitions
    switch (status) {
      case 'ongoing':
        // Can start if not started, paused, or even if completed (for reset)
        if (election.status === 'completed') {
          // Reset the election for a new round
          election.startTime = now;
          election.endTime = null;
          election.pausedAt = null;
          election.pausedDuration = 0;
        } else if (election.status !== 'not_started' && election.status !== 'paused') {
          return res.status(400).json({
            status: 'error',
            message: 'Cannot start election in current state'
          });
        }
        
        if (election.status === 'not_started') {
          election.startTime = now;
        } else if (election.status === 'paused' && election.pausedAt) {
          // Add paused duration
          const pauseDuration = now - election.pausedAt;
          election.pausedDuration = (election.pausedDuration || 0) + pauseDuration;
          election.pausedAt = null;
        }
        break;
        
      case 'paused':
        // Can only pause if ongoing
        if (election.status !== 'ongoing') {
          return res.status(400).json({
            status: 'error',
            message: 'Can only pause an ongoing election'
          });
        }
        election.pausedAt = now;
        break;
        
      case 'completed':
        // Can complete if ongoing or paused
        if (election.status !== 'ongoing' && election.status !== 'paused') {
          return res.status(400).json({
            status: 'error',
            message: 'Cannot complete election in current state'
          });
        }
        election.endTime = now;
        if (election.status === 'paused' && election.pausedAt) {
          // Add final paused duration
          const pauseDuration = now - election.pausedAt;
          election.pausedDuration = (election.pausedDuration || 0) + pauseDuration;
          election.pausedAt = null;
        }
        
        // Automatically generate and send results when manually completed
        try {
          await autoGenerateAndSendResults(election._id);
        } catch (error) {
          console.error('Error auto-generating election results:', error);
        }
        break;
    }
    
    election.status = status;
    election.updatedAt = now;
    
    await election.save();
    
    // Log the status change
    const log = new ElectionLog({
      electionId: election._id,
      action: status,
      details: `Election status changed from ${oldStatus} to ${status}`,
      userId: req.user ? req.user._id : null,
      userName: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System',
      deviceInfo: getDeviceInfo(req)
    });
    await log.save();
    
    // Emit election status update event
    const io = req.app.get('io');
    if (io) {
      io.emit('electionStatusUpdate', {
        id: election._id,
        name: election.name,
        status: election.status,
        startTime: election.startTime,
        endTime: election.endTime,
        pausedAt: election.pausedAt,
        pausedDuration: election.pausedDuration
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `Election ${status} successfully`,
      data: {
        election
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = {
  getElectionStatus,
  getElectionLogs, // Export the new function
  startElection,
  updateElectionStatus,
  checkElectionStatuses // Export the new function
};