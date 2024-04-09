// course.controller.js

const Course = require('../models/course');

// Function to create a new course
async function createCourse(req, res) {
  try {
    if(!req.user){
      return res.status(404).json({ message: 'You are not authorized to create a course' });
    }
    const { title, description, category, level} = req.body;
    const newCourse = await Course.create({ title, description, category, level, createdBy: req.user._id });
    newCourse.save()
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getCoursesById(req, res) {
  try {
    const course = await Course.findById(req.params._id);
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const userId = req.user._id
    const createdById = course.createdBy
    if(!req.user){
      return res.status(404).json({ message: 'You are not logged in to update this course' });
    }
    if (!userId.equals(createdById)) {
      return res.status(404).json({ message: 'You are not authorized to update this course' });
    }

    if (req.body.title) {
      course.title = req.body.title;
    }
    if (req.body.description) {
      course.description = req.body.description;
    }
    if (req.body.category) {
      course.category = req.body.category;
    }
    if (req.body.level) {
      course.level = req.body.level;
    }
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


// async function getCourses(req, res) {
//   try {
//     const courses = await Course.find().limit(20);
//     res.json(courses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }


async function deleteCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userId = req.user._id
    const createdById = course.createdBy
    if(!req.user){
      return res.status(404).json({ message: 'You are not logged in to update this course' });
    }
    if (!userId.equals(createdById)) {
      return res.status(404).json({ message: 'You are not authorized to update this course' });
    }
    const result = await Course.deleteOne({ _id:req.params.id });

    if (result.deletedCount === 1) {
      res.json({ message: 'Course deleted successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCourses(req, res) {
  try {
    let query = {};

    // Filtering options
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.level) {
      query.level = req.query.level;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const courses = await Course.find(query)
      .limit(limit)
      .skip(startIndex)
      .exec();

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
module.exports = {
  createCourse,
  getCourses,
  getCoursesById,
  updateCourseById,
  deleteCourseById
};
