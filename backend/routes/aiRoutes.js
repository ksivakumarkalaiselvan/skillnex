const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const googleSheetsService = require('../services/googleSheetsService');

// POST /api/ai/study-plan
router.post('/study-plan', async (req, res) => {
  try {
    const { userId, subject, goal, examDate, hoursPerDay, currentLevel } = req.body;
    const planItems = await aiService.generateStudyPlan(subject, goal, examDate, hoursPerDay || 1, currentLevel);
    
    const savedPlans = [];
    if (userId) {
      for (const item of planItems) {
        const saved = await googleSheetsService.createStudyPlan({
          user_id: userId,
          ...item
        });
        savedPlans.push(saved);
      }
    }

    return res.json({
      success: true,
      message: 'AI Study plan generated and saved successfully!',
      data: savedPlans.length ? savedPlans : planItems
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ai/teacher-copilot
router.get('/teacher-copilot', async (req, res) => {
  try {
    const students = await googleSheetsService.getUsers();
    const insights = await aiService.generateTeacherInsight(students.filter(s => s.role === 'student'));
    return res.json({ success: true, data: insights });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
