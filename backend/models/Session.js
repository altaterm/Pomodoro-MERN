const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['work', 'shortBreak', 'longBreak'],
    required: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: true
  },
  userId: {
    type: String,
    default: 'default-user' // For simplicity, using default user
  }
});

module.exports = mongoose.model('Session', SessionSchema);