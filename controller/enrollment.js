// enrollment.controller.js

const Enrollment = require('../models/enrollment');

// Function to enroll user in a course
async function enrollCourse(req, res) {
  try {
    const { userId, courseId } = req.body;
    const newEnrollment = await Enrollment.create({ user: userId, course: courseId });
    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  enrollCourse
};
