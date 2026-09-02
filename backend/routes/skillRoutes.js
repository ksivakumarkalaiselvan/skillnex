const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheetsService');

// GET /api/skills/:userId
router.get('/:userId', async (req, res) => {
  try {
    const skills = await googleSheetsService.getSkills(req.params.userId);
    return res.json({ success: true, data: skills });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/skills/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await googleSheetsService.updateSkill(req.params.id, req.body);
    return res.json({ success: true, message: 'Skill updated', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
