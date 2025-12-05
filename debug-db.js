const mongoose = require('mongoose');
require('dotenv').config();

const debugDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get all users and show their details
    const User = require('./models/User');
    const users = await User.find({});
    
    console.log('=== ALL USERS IN DATABASE ===');
    users.forEach(user => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Password Hash: ${user.password}`);
      console.log(`Password Length: ${user.password.length}`);
      console.log(`Profile Completed: ${user.profileCompleted}`);
      console.log('---');
    });

    // Check specifically for our test learner
    const testLearner = await User.findOne({ email: 'learner@test.com' });
    console.log('=== SPECIFIC USER CHECK ===');
    console.log('learner@test.com found:', !!testLearner);
    if (testLearner) {
      console.log('User details:', {
        id: testLearner._id,
        name: testLearner.name,
        email: testLearner.email,
        passwordLength: testLearner.password.length,
        profileCompleted: testLearner.profileCompleted
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

debugDatabase();