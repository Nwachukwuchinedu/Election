const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  matricNumber: {
    type: String,
    required: true,
    unique: true
  },
  level: {
    type: Number,
    required: true,
    enum: [100, 200, 300, 400]
  },
  password: {
    type: String,
    required: true
  },
  hasVoted: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Voter', voterSchema);