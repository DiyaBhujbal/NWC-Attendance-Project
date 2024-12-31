// In your backend routes file (e.g., routes/attendance.js)
const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Assuming you have a Student model

// Route to get defaulter students
router.get('/defaulters', async (req, res) => {
  try {
    const defaulterThreshold = 75; // Define your threshold percentage
    const defaulters = await Student.find({
      attendancePercentage: { $lt: defaulterThreshold }
    });
    res.json(defaulters);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
