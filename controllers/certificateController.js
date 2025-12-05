const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const { v4: uuidv4 } = require('uuid');

exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const enrollment = await Enrollment.findOne({
      learner: req.user.id,
      course: courseId,
      completed: true
    }).populate('course').populate('learner');

    if (!enrollment) {
      return res.status(400).json({
        status: 'error',
        message: 'Course not completed or enrollment not found'
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      learner: req.user.id,
      course: courseId
    });

    if (existingCertificate) {
      return res.status(200).json({
        status: 'success',
        data: {
          certificate: existingCertificate
        }
      });
    }

    const certificateId = uuidv4();
    const certificate = await Certificate.create({
      learner: req.user.id,
      course: courseId,
      certificateId,
      verificationUrl: `${process.env.BASE_URL}/certificates/verify/${certificateId}`
    });

    await certificate.populate('course');
    await certificate.populate('learner', 'name email');

    res.status(201).json({
      status: 'success',
      data: {
        certificate
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ learner: req.user.id })
      .populate('course', 'title description instructor')
      .populate('course.instructor', 'name');

    res.status(200).json({
      status: 'success',
      data: {
        certificates
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    const certificate = await Certificate.findOne({ certificateId })
      .populate('learner', 'name')
      .populate('course', 'title description instructor')
      .populate('course.instructor', 'name');

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        certificate,
        valid: true
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};