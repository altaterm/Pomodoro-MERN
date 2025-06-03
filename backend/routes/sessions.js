const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ completedAt: -1 }).limit(50);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new session
router.post('/', async (req, res) => {
  try {
    const session = new Session({
      type: req.body.type,
      duration: req.body.duration,
      completed: req.body.completed || true
    });
    
    const savedSession = await session.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get session statistics
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = await Session.find({
      completedAt: { $gte: today },
      completed: true
    });
    
    const totalSessions = await Session.countDocuments({ completed: true });
    
    const stats = {
      todayWork: todaySessions.filter(s => s.type === 'work').length,
      todayBreaks: todaySessions.filter(s => s.type !== 'work').length,
      totalSessions: totalSessions,
      todayMinutes: todaySessions.reduce((total, session) => total + session.duration, 0)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;