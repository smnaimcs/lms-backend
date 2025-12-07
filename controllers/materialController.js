const Course = require('../models/Course');
const path = require('path');
const fs = require('fs');

// Add section to course
exports.addSection = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Check if instructor owns the course
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to modify this course'
      });
    }
    
    const newSection = {
      title,
      description,
      order: course.sections.length
    };
    
    course.sections.push(newSection);
    await course.save();

    const savedSection = course.sections[course.sections.length - 1];
    
    res.status(201).json({
      status: 'success',
      data: {
        section: savedSection,
        message: 'Section added successfully'
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Upload text material
exports.addTextMaterial = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, content, duration } = req.body;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Check authorization
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({
        status: 'error',
        message: 'Section not found'
      });
    }
    
    const newMaterial = {
      title,
      type: 'text',
      content: content,
      duration: duration || 0,
      order: section.materials.length
    };
    
    section.materials.push(newMaterial);
    await course.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        material: newMaterial,
        message: 'Text material added successfully'
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Upload video material
exports.addVideoMaterial = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, duration } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No video file uploaded'
      });
    }
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      // Delete uploaded file if course not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Check authorization
    if (course.instructor.toString() !== req.user.id) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const section = course.sections.id(sectionId);
    if (!section) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: 'error',
        message: 'Section not found'
      });
    }
    
    const videoUrl = `/uploads/videos/${path.basename(req.file.path)}`;
    
    const newMaterial = {
      title,
      type: 'video',
      content: videoUrl,
      duration: duration || 0,
      order: section.materials.length
    };
    
    section.materials.push(newMaterial);
    await course.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        material: newMaterial,
        message: 'Video material added successfully'
      }
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Upload audio material
exports.addAudioMaterial = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, duration } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No audio file uploaded'
      });
    }
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Check authorization
    if (course.instructor.toString() !== req.user.id) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const section = course.sections.id(sectionId);
    if (!section) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: 'error',
        message: 'Section not found'
      });
    }
    
    const audioUrl = `/uploads/audios/${path.basename(req.file.path)}`;
    
    const newMaterial = {
      title,
      type: 'audio',
      content: audioUrl,
      duration: duration || 0,
      order: section.materials.length
    };
    
    section.materials.push(newMaterial);
    await course.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        material: newMaterial,
        message: 'Audio material added successfully'
      }
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Add MCQ material
exports.addMCQMaterial = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, questions, duration } = req.body;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Check authorization
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({
        status: 'error',
        message: 'Section not found'
      });
    }
    
    // Validate questions structure
    if (!Array.isArray(questions)) {
      return res.status(400).json({
        status: 'error',
        message: 'Questions must be an array'
      });
    }
    
    const newMaterial = {
      title,
      type: 'mcq',
      content: { questions },
      duration: duration || 0,
      order: section.materials.length
    };
    
    section.materials.push(newMaterial);
    await course.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        material: newMaterial,
        message: 'MCQ material added successfully'
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get course materials (for enrolled learners)
exports.getCourseMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check enrollment (you need to implement this check based on your Enrollment model)
    const Enrollment = require('../models/Enrollment');
    const enrollment = await Enrollment.findOne({
      learner: req.user.id,
      course: courseId
    });
    
    if (!enrollment && req.user.role !== 'instructor') {
      return res.status(403).json({
        status: 'error',
        message: 'You are not enrolled in this course'
      });
    }
    
    const course = await Course.findById(courseId)
      .select('title sections')
      .populate('instructor', 'name');
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        course: {
          _id: course._id,
          title: course.title,
          instructor: course.instructor,
          sections: course.sections.filter(s => s.isPublished)
        },
        enrollment: enrollment || null
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update material order
exports.updateMaterialOrder = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { materialOrders } = req.body; // Array of {materialId, order}
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Check authorization
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({
        status: 'error',
        message: 'Section not found'
      });
    }
    
    // Update orders
    materialOrders.forEach(({ materialId, order }) => {
      const material = section.materials.id(materialId);
      if (material) {
        material.order = order;
      }
    });
    
    // Sort materials by order
    section.materials.sort((a, b) => a.order - b.order);
    
    await course.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Material order updated successfully'
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete material
exports.deleteMaterial = async (req, res) => {
  try {
    const { courseId, sectionId, materialId } = req.params;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Check authorization
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({
        status: 'error',
        message: 'Section not found'
      });
    }
    
    const material = section.materials.id(materialId);
    if (!material) {
      return res.status(404).json({
        status: 'error',
        message: 'Material not found'
      });
    }
    
    // Delete file if it's a video/audio/PDF
    if (['video', 'audio', 'pdf'].includes(material.type)) {
      const filePath = path.join(__dirname, '..', material.content);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Remove material
    section.materials.pull(materialId);
    await course.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Material deleted successfully'
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};