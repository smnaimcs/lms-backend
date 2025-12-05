const User = require('../models/User');
const bankService = require('../utils/bankService');

exports.setupBankInfo = async (req, res) => {
  try {
    const { accountNumber, secretKey } = req.body;
    const user = await User.findById(req.user.id);

    user.bankAccount = {
      accountNumber,
      secretKey,
      balance: user.bankAccount.balance || 10000
    };
    user.profileCompleted = true;

    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          profileCompleted: user.profileCompleted
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

exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const balanceInfo = await bankService.getBalance(user.bankAccount);

    res.status(200).json({
      status: 'success',
      data: {
        balance: balanceInfo
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompleted: user.profileCompleted,
          bankAccount: {
            accountNumber: user.bankAccount.accountNumber,
            balance: user.bankAccount.balance
          }
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