const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testImmediate = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const user = await User.findOne({ email: 'learner@test.com' }).select('+password');
  console.log('User found:', !!user);
  
  if (user) {
    const bcrypt = require('bcryptjs');
    const isCorrect = await bcrypt.compare('password123', user.password);
    console.log('Password correct:', isCorrect);
    console.log('Password hash:', user.password);
  }
  
  process.exit(0);
};

testImmediate();