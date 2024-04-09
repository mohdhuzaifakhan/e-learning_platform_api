var express = require('express')
const router = express.Router()
const {getCourses, createCourse,getCoursesById,updateCourseById,deleteCourseById} = require('../controller/course')



router.post('/',createCourse)
router.get('/',getCourses);
router.get('/:_id',getCoursesById);
router.put('/:id',updateCourseById);
router.delete('/:id',deleteCourseById);


module.exports = router;
