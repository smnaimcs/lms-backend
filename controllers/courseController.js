const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const LMSOrganization = require('../models/LMSOrganization');
const bankService = require('../utils/bankService');
const Transaction = require('../models/Transaction'); // ADD THIS LINE
const mongoose = require('mongoose');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .populate('instructor', 'name email');

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Check if user is enrolled (if authenticated)
    let isEnrolled = false;
    let enrollment = null;
    
    if (req.user) {
      enrollment = await Enrollment.findOne({
        learner: req.user.id,
        course: req.params.id
      });
      isEnrolled = !!enrollment;
    }

    res.status(200).json({
      status: 'success',
      data: {
        course,
        isEnrolled,
        enrollment
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// exports.createCourse = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { title, description, price, category, materials } = req.body;
//     const instructor = await User.findById(req.user.id);
//     const lmsOrg = await LMSOrganization.findOne({});
    
//     // Calculate instructor payout (70% of course price as lump sum)
//     const instructorPayout = price * 0.7;

//     // Create course
//     const course = await Course.create([{
//       title,
//       description,
//       price,
//       category,
//       materials,
//       instructorPayout,
//       instructor: req.user.id
//     }], { session });

//     // Process immediate lump sum payout to instructor
//     const payoutResult = await bankService.processPayout(
//       lmsOrg.bankAccount,
//       instructor.bankAccount,
//       instructorPayout
//     );

//     // Update LMS balance
//     lmsOrg.bankAccount.balance -= instructorPayout;
//     lmsOrg.totalPayouts += instructorPayout;
//     await lmsOrg.save({ session });

//     // Update instructor balance
//     instructor.bankAccount.balance += instructorPayout;
//     await instructor.save({ session });

//     // Record the payout transaction
//     await Transaction.create([{
//       fromUser: null, // LMS organization
//       toUser: instructor._id,
//       course: course[0]._id,
//       amount: instructorPayout,
//       type: 'course_upload_payout',
//       status: 'completed',
//       bankReference: payoutResult.transactionId,
//       description: `Lump sum payout for course upload: ${title}`
//     }], { session });

//     await session.commitTransaction();

//     res.status(201).json({
//       status: 'success',
//       data: {
//         course: course[0],
//         payoutAmount: instructorPayout,
//         message: 'Course created successfully! Lump sum payment has been transferred to your account.'
//       }
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(400).json({
//       status: 'error',
//       message: error.message
//     });
//   } finally {
//     session.endSession();
//   }
// };

exports.createCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, description, price, category, materials } = req.body;
    const instructor = await User.findById(req.user.id);
    const lmsOrg = await LMSOrganization.findOne({});
    const lmsUser = await User.findOne({ email: 'lms@organization.com' }); // Get LMS user
    
    if (!lmsUser) {
      throw new Error('LMS user not found. Please run the LMS setup script.');
    }

    // Calculate instructor payout (70% of course price as lump sum)
    const instructorPayout = price * 0.7;

    // Create course
    const course = await Course.create([{
      title,
      description,
      price,
      category,
      materials,
      instructorPayout,
      instructor: req.user.id
    }], { session });

    // Process immediate lump sum payout to instructor
    const payoutResult = await bankService.processPayout(
      lmsOrg.bankAccount,
      instructor.bankAccount,
      instructorPayout
    );

    // Update LMS balance
    lmsOrg.bankAccount.balance -= instructorPayout;
    lmsOrg.totalPayouts += instructorPayout;
    await lmsOrg.save({ session });

    // Update instructor balance
    instructor.bankAccount.balance += instructorPayout;
    await instructor.save({ session });

    // Record the payout transaction - USE LMS USER ID instead of null
    await Transaction.create([{
      fromUser: lmsUser._id, // Use LMS user ID instead of null
      toUser: instructor._id,
      course: course[0]._id,
      amount: instructorPayout,
      type: 'course_upload_payout', // This should now be valid
      status: 'completed',
      bankReference: payoutResult.transactionId,
      description: `Lump sum payout for course upload: ${title}`
    }], { session });

    await session.commitTransaction();

    res.status(201).json({
      status: 'success',
      data: {
        course: course[0],
        payoutAmount: instructorPayout,
        message: 'Course created successfully! Lump sum payment has been transferred to your account.'
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in createCourse:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

// New: Get course materials (only if enrolled)
exports.getCourseMaterials = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    // Check if user is enrolled in this course
    const enrollment = await Enrollment.findOne({
      learner: req.user.id,
      course: courseId
    }).populate('course');

    if (!enrollment) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not enrolled in this course'
      });
    }

    const course = await Course.findById(courseId);
    
    res.status(200).json({
      status: 'success',
      data: {
        course: {
          title: course.title,
          materials: course.materials
        },
        enrollment: {
          progress: enrollment.progress,
          completed: enrollment.completed
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ learner: req.user.id })
      .populate('course')
      .populate('course.instructor', 'name')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        enrollments
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const enrollment = await Enrollment.findOne({
      learner: req.user.id,
      course: req.params.courseId
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        status: 'error',
        message: 'Enrollment not found'
      });
    }

    enrollment.progress = Math.min(100, Math.max(0, progress));
    
    // Check if course is completed
    if (enrollment.progress >= 100 && !enrollment.completed) {
      enrollment.completed = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      status: 'success',
      data: {
        enrollment,
        message: enrollment.completed ? 'Course completed! You can now generate a certificate.' : 'Progress updated'
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};