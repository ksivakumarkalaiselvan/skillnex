const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheetsService');

// GET /api/study-plans/:userId
router.get('/:userId', async (req, res) => {
  try {
    const plans = await googleSheetsService.getStudyPlans(req.params.userId);
    return res.json({ success: true, data: plans });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/study-plans
router.post('/', async (req, res) => {
  try {
    const plan = await googleSheetsService.createStudyPlan(req.body);
    return res.json({ success: true, message: 'Study plan saved', data: plan });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/study-plans/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await googleSheetsService.updateStudyPlan(req.params.id, req.body);
    return res.json({ success: true, message: 'Plan updated', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
