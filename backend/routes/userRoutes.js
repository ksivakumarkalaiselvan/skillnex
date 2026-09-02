const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheetsService');
const aiService = require('../services/aiService');

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await googleSheetsService.getUsers();
    // Add risk analysis for each student
    const usersWithRisk = await Promise.all(users.map(async u => {
      const { password: _, ...safeUser } = u;
      if (u.role === 'student') {
        const riskData = await aiService.calculateRisk(u);
        return { ...safeUser, risk: riskData };
      }
      return safeUser;
    }));
    return res.json({ success: true, data: usersWithRisk });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await googleSheetsService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { password: _, ...safeUser } = user;
    return res.json({ success: true, data: safeUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await googleSheetsService.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
    const { password: _, ...safeUser } = updated;
    return res.json({ success: true, message: 'User updated', data: safeUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
