const mongoose = require('mongoose');
const LMSOrganization = require('./models/LMSOrganization');
require('dotenv').config();

const initLMS = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const existingLMS = await LMSOrganization.findOne({});
    if (existingLMS) {
      console.log('LMS Organization already exists:');
      console.log('Name:', existingLMS.name);
      console.log('Balance:', existingLMS.bankAccount.balance);
      process.exit(0);
    }

    const lmsOrg = await LMSOrganization.create({
      name: 'LearnPro LMS',
      bankAccount: {
        accountNumber: 'LMS001',
        secretKey: 'lmssecret123',
        balance: 1000000
      },
      totalPayouts: 0,
      totalRevenue: 0
    });

    console.log('✅ LMS Organization created successfully!');
    console.log('Name:', lmsOrg.name);
    console.log('Account Number:', lmsOrg.bankAccount.accountNumber);
    console.log('Initial Balance:', lmsOrg.bankAccount.balance);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

initLMS();