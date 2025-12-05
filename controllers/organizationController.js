const LMSOrganization = require('../models/LMSOrganization');
const User = require('../models/User');
const Course = require('../models/Course');
const Transaction = require('../models/Transaction');
const bankService = require('../utils/bankService');

exports.getLMSBalance = async (req, res) => {
  try {
    const lmsOrg = await LMSOrganization.findOne({});
    
    const balanceInfo = await bankService.getLMSBalance(lmsOrg);

    res.status(200).json({
      status: 'success',
      data: {
        organization: balanceInfo
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getOrganizationStats = async (req, res) => {
  try {
    const lmsOrg = await LMSOrganization.findOne({});
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalLearners = await User.countDocuments({ role: 'learner' });
    const totalCourses = await Course.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    const recentTransactions = await Transaction.find()
      .populate('fromUser', 'name')
      .populate('toUser', 'name')
      .populate('course', 'title')
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalInstructors,
          totalLearners,
          totalCourses,
          totalTransactions,
          totalRevenue: lmsOrg.totalRevenue,
          totalPayouts: lmsOrg.totalPayouts,
          currentBalance: lmsOrg.bankAccount.balance
        },
        recentTransactions
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};