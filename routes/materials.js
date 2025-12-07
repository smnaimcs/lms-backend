const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const materialController = require('../controllers/materialController');
const { uploadVideo, uploadAudio, uploadPdf, uploadImage } = require('../config/upload');

// All routes require authentication
router.use(protect);

// Section management
router.post('/:courseId/sections', restrictTo('instructor'), materialController.addSection);

// Material management
router.post('/:courseId/sections/:sectionId/text', restrictTo('instructor'), materialController.addTextMaterial);
router.post('/:courseId/sections/:sectionId/video', restrictTo('instructor'), uploadVideo, materialController.addVideoMaterial);
router.post('/:courseId/sections/:sectionId/audio', restrictTo('instructor'), uploadAudio, materialController.addAudioMaterial);
router.post('/:courseId/sections/:sectionId/mcq', restrictTo('instructor'), materialController.addMCQMaterial);

// Get materials (for enrolled learners and instructors)
router.get('/:courseId/materials', materialController.getCourseMaterials);

// Update material order
router.patch('/:courseId/sections/:sectionId/order', restrictTo('instructor'), materialController.updateMaterialOrder);

// Delete material
router.delete('/:courseId/sections/:sectionId/materials/:materialId', restrictTo('instructor'), materialController.deleteMaterial);

module.exports = router;