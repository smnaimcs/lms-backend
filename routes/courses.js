const express = require('express');
const { 
  getCourses, 
  getCourse, 
  createCourse, 
  getEnrolledCourses, 
  updateProgress,
  getCourseMaterials 
} = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourse);

router.use(protect);

router.get('/enrolled/mine', getEnrolledCourses);
router.patch('/:courseId/progress', updateProgress);
router.get('/:courseId/materials', getCourseMaterials);

// Instructor only routes
router.post('/', restrictTo('instructor'), createCourse);

module.exports = router;