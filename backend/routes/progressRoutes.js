const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheetsService');

// GET /api/progress/:userId
router.get('/:userId', async (req, res) => {
  try {
    const progress = await googleSheetsService.getProgress(req.params.userId);
    return res.json({ success: true, data: progress });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/progress
router.post('/', async (req, res) => {
  try {
    const updated = await googleSheetsService.createOrUpdateProgress(req.body);
    return res.json({ success: true, message: 'Progress updated', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
