const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Testing login for learner@test.com...');
    
    // Find user with password
    const user = await User.findOne({ email: 'learner@test.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('Stored password hash:', user.password);
    console.log('Password length:', user.password.length);
    
    // Test password comparison
    const isCorrect = await user.correctPassword('password123', user.password);
    console.log('Password verification result:', isCorrect);
    
    // Manual bcrypt comparison
    const bcrypt = require('bcryptjs');
    const manualCheck = await bcrypt.compare('password123', user.password);
    console.log('Manual bcrypt comparison:', manualCheck);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

testLogin();