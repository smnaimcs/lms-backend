const mongoose = require('mongoose');
require('dotenv').config();

const checkLMS = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Dynamically import the model
    const LMSOrganization = require('./models/LMSOrganization');
    
    const lmsOrg = await LMSOrganization.findOne({});
    if (lmsOrg) {
      console.log('\n✅ LMS Organization found:');
      console.log('Name:', lmsOrg.name);
      console.log('Account Number:', lmsOrg.bankAccount.accountNumber);
      console.log('Balance:', lmsOrg.bankAccount.balance);
      console.log('Total Payouts:', lmsOrg.totalPayouts);
    } else {
      console.log('\n❌ No LMS Organization found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
    process.exit(0);
  }
};

checkLMS();