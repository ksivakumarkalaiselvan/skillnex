const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheetsService');

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const courses = await googleSheetsService.getCourses();
    return res.json({ success: true, data: courses });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/courses
router.post('/', async (req, res) => {
  try {
    const course = await googleSheetsService.createCourse(req.body);
    return res.json({ success: true, message: 'Course created successfully', data: course });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
