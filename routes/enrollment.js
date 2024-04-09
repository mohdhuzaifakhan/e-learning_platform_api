const express = require('express');
const router = express.Router();
const { enrollCourse, getAllEnrollCoursesByUserId } = require('../controller/enrollment');

// Course Enrollment
router.post('/', enrollCourse);

// View Enrolled Courses
router.get('/:userId', getAllEnrollCoursesByUserId);

module.exports = router;
