const Transaction = require('../models/Transaction');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const LMSOrganization = require('../models/LMSOrganization');
const bankService = require('../utils/bankService');
const mongoose = require('mongoose');

exports.purchaseCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('req.user >>>', req.user);  

    const { courseId } = req.body;
    // const learner = await User.findById(req.user.id);
    const learner = await User.findById(req.user.id)
      .select('+bankAccount +bankAccount.secretKey');

     console.log('Learner fetched:', learner);

    const course = await Course.findById(courseId).populate('instructor');
    const lmsOrg = await LMSOrganization.findOne({});

    if (!course) {
      throw new Error('Course not found');
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      learner: learner._id,
      course: courseId
    });
    if (existingEnrollment) {
      throw new Error('Already enrolled in this course');
    }

    // log things to pin point
    console.log("learner.bankAccount >>>", learner.bankAccount);
    console.log("lmsOrg.bankAccount >>>", lmsOrg.bankAccount);
    console.log("course.price >>>", course.price);
    console.log("learner.bankAccount.secretKey >>>", learner.bankAccount.secretKey);


    // Process bank transaction from learner to LMS
    const bankResult = await bankService.processTransaction(
      learner.bankAccount,
      lmsOrg.bankAccount,
      course.price,
      learner.bankAccount.secretKey
    );

    // Update learner balance
    learner.bankAccount.balance = bankResult.newBalance;
    await learner.save({ session });

    // Update LMS balance
    lmsOrg.bankAccount.balance += course.price;
    lmsOrg.totalRevenue += course.price;
    await lmsOrg.save({ session });

    // Create enrollment
    const enrollment = await Enrollment.create([{
      learner: learner._id,
      course: courseId,
      progress: 0
    }], { session });

    // Create purchase transaction record
    const purchaseTransaction = await Transaction.create([{
      fromUser: learner._id,
      toUser: null, // LMS organization
      course: courseId,
      amount: course.price,
      type: 'course_purchase',
      status: 'completed',
      bankReference: bankResult.transactionId,
      description: `Purchase of course: ${course.title}`
    }], { session });

    // Create pending payout transaction for instructor
    const payoutTransaction = await Transaction.create([{
      fromUser: null, // LMS organization
      toUser: course.instructor._id,
      course: courseId,
      amount: course.instructorPayout,
      type: 'instructor_payout',
      status: 'pending', // Requires instructor validation
      description: `Payout for course sale: ${course.title}`
    }], { session });

    await session.commitTransaction();

    res.status(200).json({
      status: 'success',
      data: {
        enrollment: enrollment[0],
        transaction: purchaseTransaction[0],
        bankReference: bankResult.transactionId,
        message: 'Course purchased successfully! You can now access the course materials.'
      }
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

// New: Instructor validates and collects payout
exports.validateAndCollectPayout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.body;
    const instructor = await User.findById(req.user.id);
    const lmsOrg = await LMSOrganization.findOne({});

    // Find pending payout transaction for this instructor
    const payoutTransaction = await Transaction.findOne({
      _id: transactionId,
      toUser: instructor._id,
      type: 'instructor_payout',
      status: 'pending'
    }).populate('course');

    if (!payoutTransaction) {
      throw new Error('Pending payout not found');
    }

    // Validate transaction with bank (simulated)
    const validationResult = await bankService.validateTransaction(
      payoutTransaction.bankReference
    );

    if (!validationResult.valid) {
      throw new Error('Bank validation failed');
    }

    // Process payout from LMS to instructor
    const payoutResult = await bankService.processPayout(
      lmsOrg.bankAccount,
      instructor.bankAccount,
      payoutTransaction.amount
    );

    // Update LMS balance
    lmsOrg.bankAccount.balance -= payoutTransaction.amount;
    lmsOrg.totalPayouts += payoutTransaction.amount;
    await lmsOrg.save({ session });

    // Update instructor balance
    instructor.bankAccount.balance += payoutTransaction.amount;
    await instructor.save({ session });

    // Update transaction status
    payoutTransaction.status = 'completed';
    payoutTransaction.bankReference = payoutResult.transactionId;
    await payoutTransaction.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      status: 'success',
      data: {
        transaction: payoutTransaction,
        payoutAmount: payoutTransaction.amount,
        newBalance: instructor.bankAccount.balance,
        message: 'Payout collected successfully!'
      }
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

// New: Get pending payouts for instructor
exports.getPendingPayouts = async (req, res) => {
  try {
    const pendingPayouts = await Transaction.find({
      toUser: req.user.id,
      type: 'instructor_payout',
      status: 'pending'
    })
    .populate('course', 'title price')
    .populate('fromUser', 'name')
    .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        pendingPayouts,
        totalPending: pendingPayouts.reduce((sum, t) => sum + t.amount, 0)
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { fromUser: req.user.id },
        { toUser: req.user.id }
      ]
    })
    .populate('fromUser', 'name')
    .populate('toUser', 'name')
    .populate('course', 'title')
    .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        transactions
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};