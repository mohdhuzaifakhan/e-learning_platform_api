const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollment');

// Course Enrollment
router.post('/', async (req, res) => {
  try {

    if(!req.user){
        res.status(400).json({ message: 'You can not enroll in a course , please login' });
    }
    userId = req.user?._id
    const {courseId } = req.body;

    // Check if user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }

    // Create new enrollment
    const enrollment = new Enrollment({ user: userId, course: courseId });
    await enrollment.save();

    res.status(201).json({ message: 'User enrolled in the course successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// View Enrolled Courses
router.get('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;

      // Find all enrollments for the user
      const enrollments = await Enrollment.find({ user: userId }).populate('course');

      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
