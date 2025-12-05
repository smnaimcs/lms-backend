const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createLMSUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if LMS user already exists
    let lmsUser = await User.findOne({ email: 'lms@organization.com' });
    
    if (!lmsUser) {
      lmsUser = await User.create({
        name: 'LMS Organization',
        email: 'lms@organization.com',
        password: 'lms_password_123',
        role: 'admin',
        profileCompleted: true,
        bankAccount: {
          accountNumber: 'LMS001',
          secretKey: 'lmssecret123',
          balance: 1000000
        }
      });
      console.log('✅ LMS User created successfully');
    } else {
      console.log('✅ LMS User already exists');
    }
    
    console.log('LMS User ID:', lmsUser._id);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createLMSUser();