const mongoose = require('mongoose');

const electionLogSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['created', 'started', 'paused', 'resumed', 'completed', 'reset']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId
  },
  userName: {
    type: String
  }
});

module.exports = mongoose.model('ElectionLog', electionLogSchema);