const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheetsService');

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const users = await googleSheetsService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Return sanitized user object
    const { password: _, ...safeUser } = user;
    return res.json({
      success: true,
      message: 'Login successful',
      data: safeUser
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, city, department, year } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await googleSheetsService.getUserById(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const createdUser = await googleSheetsService.createUser({
      name,
      email,
      password,
      role: role || 'student',
      city: city || 'Coimbatore',
      department: department || 'Computer Science',
      year: year || '1st Year'
    });

    // Create default skill profile for student
    if (role === 'student') {
      await googleSheetsService.updateSkill("SK-" + Date.now(), {
        user_id: createdUser.user_id,
        skill_name: "Programming",
        score: 60,
        level: "Developing",
        trend: "Up",
        ai_recommendation: "Start Python basics module"
      });
    }

    const { password: _, ...safeUser } = createdUser;
    return res.json({
      success: true,
      message: 'User registered successfully',
      data: safeUser
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
