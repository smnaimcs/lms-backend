const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetAndSeed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear everything
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared');

    // Import models
    const User = require('./models/User');
    const Course = require('./models/Course');

    // Create users one by one to ensure password hashing works
    const hashedPassword = await bcrypt.hash('password123', 12);
    console.log('Hashed password created:', hashedPassword);

    // Create instructor 1
    const instructor1 = new User({
      name: 'John Doe',
      email: 'john@instructor.com',
      password: hashedPassword,
      role: 'instructor',
      profileCompleted: true,
      bankAccount: {
        accountNumber: 'ACC001',
        secretKey: 'secret1',
        balance: 10000
      }
    });
    await instructor1.save();

    // Create instructor 2
    const instructor2 = new User({
      name: 'Jane Smith',
      email: 'jane@instructor.com',
      password: hashedPassword,
      role: 'instructor',
      profileCompleted: true,
      bankAccount: {
        accountNumber: 'ACC002',
        secretKey: 'secret2',
        balance: 10000
      }
    });
    await instructor2.save();

    // Create instructor 3
    const instructor3 = new User({
      name: 'Mike Johnson',
      email: 'mike@instructor.com',
      password: hashedPassword,
      role: 'instructor',
      profileCompleted: true,
      bankAccount: {
        accountNumber: 'ACC003',
        secretKey: 'secret3',
        balance: 10000
      }
    });
    await instructor3.save();

    // Create test learner
    const learner = new User({
      name: 'Test Learner',
      email: 'learner@test.com',
      password: hashedPassword,
      role: 'learner',
      profileCompleted: true,
      bankAccount: {
        accountNumber: 'ACC004',
        secretKey: 'secret4',
        balance: 10000
      }
    });
    await learner.save();

    console.log('All users created successfully');

    // Verify the learner's password
    const verifyLearner = await User.findOne({ email: 'learner@test.com' }).select('+password');
    const isCorrect = await bcrypt.compare('password123', verifyLearner.password);
    console.log('Password verification for learner@test.com:', isCorrect);

    // Create courses
    const courses = await Course.create([
      {
        title: 'Web Development Fundamentals',
        description: 'Learn web development basics',
        instructor: instructor1._id,
        price: 99,
        category: 'Programming',
        instructorPayout: 69.3
      },
      {
        title: 'Advanced JavaScript',
        description: 'Master JavaScript',
        instructor: instructor1._id,
        price: 149,
        category: 'Programming',
        instructorPayout: 104.3
      },
      {
        title: 'Data Science with Python',
        description: 'Learn data science',
        instructor: instructor2._id,
        price: 199,
        category: 'Data Science',
        instructorPayout: 139.3
      },
      {
        title: 'Mobile App Development',
        description: 'Build mobile apps',
        instructor: instructor2._id,
        price: 179,
        category: 'Mobile Development',
        instructorPayout: 125.3
      },
      {
        title: 'Cloud Computing Basics',
        description: 'Understand cloud services',
        instructor: instructor3._id,
        price: 129,
        category: 'Cloud',
        instructorPayout: 90.3
      }
    ]);

    console.log('Created 5 courses');
    console.log('\n=== SEED COMPLETE ===');
    console.log('Test with: learner@test.com / password123');

    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAndSeed();