const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'General Election'
  },
  status: {
    type: String,
    enum: ['not_started', 'ongoing', 'paused', 'completed'],
    default: 'not_started'
  },
  startTime: {
    type: Date,
    required: false
  },
  endTime: {
    type: Date,
    required: false
  },
  pausedAt: {
    type: Date,
    required: false
  },
  pausedDuration: {
    type: Number,
    default: 0 // in milliseconds
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
electionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Election', electionSchema);