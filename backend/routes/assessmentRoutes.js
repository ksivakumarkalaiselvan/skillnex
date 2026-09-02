const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheetsService');

// GET /api/assessments
router.get('/', async (req, res) => {
  try {
    const assessments = await googleSheetsService.getAssessments();
    return res.json({ success: true, data: assessments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/assessments
router.post('/', async (req, res) => {
  try {
    const assessment = await googleSheetsService.createAssessment(req.body);
    return res.json({ success: true, message: 'Assessment created successfully', data: assessment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/assessment-results/:userId
router.get('/results/:userId', async (req, res) => {
  try {
    const results = await googleSheetsService.getAssessmentResults(req.params.userId);
    return res.json({ success: true, data: results });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/assessment-results
router.post('/results', async (req, res) => {
  try {
    const result = await googleSheetsService.createAssessmentResult(req.body);

    // Auto-create notification if weak topic detected
    if (result.weak_topic && result.user_id) {
      await googleSheetsService.createNotification({
        user_id: result.user_id,
        title: "⚠ Weak Topic Detected",
        message: `${result.weak_topic} needs practice based on your latest quiz.`,
        type: "Warning"
      });
    }

    return res.json({ success: true, message: 'Result submitted successfully', data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
