const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms-system');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data');

    // Hash passwords manually for seed data
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create instructors with properly hashed passwords
    const instructors = await User.create([
      {
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
      },
      {
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
      },
      {
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
      }
    ]);

    console.log('Created instructors');

    // Create courses
    const courses = await Course.create([
      {
        title: 'Web Development Fundamentals',
        description: 'Learn the basics of web development with HTML, CSS, and JavaScript',
        instructor: instructors[0]._id,
        price: 99,
        category: 'Programming',
        instructorPayout: 69.3,
        materials: [
          {
            type: 'video',
            title: 'Introduction to HTML',
            content: 'https://example.com/videos/html-intro',
            duration: 30
          }
        ]
      },
      {
        title: 'Advanced JavaScript',
        description: 'Master advanced JavaScript concepts and modern ES6+ features',
        instructor: instructors[0]._id,
        price: 149,
        category: 'Programming',
        instructorPayout: 104.3,
        materials: [
          {
            type: 'video',
            title: 'Closures and Scope',
            content: 'https://example.com/videos/js-closures',
            duration: 45
          }
        ]
      },
      {
        title: 'Data Science with Python',
        description: 'Introduction to data science using Python and popular libraries',
        instructor: instructors[1]._id,
        price: 199,
        category: 'Data Science',
        instructorPayout: 139.3,
        materials: [
          {
            type: 'video',
            title: 'Pandas Basics',
            content: 'https://example.com/videos/pandas-basics',
            duration: 60
          }
        ]
      },
      {
        title: 'Mobile App Development',
        description: 'Build mobile apps with React Native for iOS and Android',
        instructor: instructors[1]._id,
        price: 179,
        category: 'Mobile Development',
        instructorPayout: 125.3,
        materials: [
          {
            type: 'video',
            title: 'React Native Setup',
            content: 'https://example.com/videos/react-native-setup',
            duration: 40
          }
        ]
      },
      {
        title: 'Cloud Computing Basics',
        description: 'Understanding cloud services and deployment strategies',
        instructor: instructors[2]._id,
        price: 129,
        category: 'Cloud',
        instructorPayout: 90.3,
        materials: [
          {
            type: 'video',
            title: 'AWS Overview',
            content: 'https://example.com/videos/aws-overview',
            duration: 50
          }
        ]
      }
    ]);

    console.log('Created 5 courses');

    // Create a sample learner with properly hashed password
    const learner = await User.create({
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

    console.log('Created sample learner');
    
    // Verify the learner was created properly
    const verifyLearner = await User.findOne({ email: 'learner@test.com' }).select('+password');
    const isPasswordCorrect = await bcrypt.compare('password123', verifyLearner.password);
    
    console.log('\n=== VERIFICATION ===');
    console.log('Learner found:', !!verifyLearner);
    console.log('Password verification:', isPasswordCorrect);
    console.log('=======================\n');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Instructors: ${instructors.length}`);
    console.log(`Courses: ${courses.length}`);
    console.log('Sample Learner: learner@test.com / password123');
    console.log('=======================\n');

    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Add this to your seed.js after connecting to MongoDB
const LMSOrganization = require('./models/LMSOrganization');

// Create LMS Organization if it doesn't exist
let lmsOrg = await LMSOrganization.findOne({});
if (!lmsOrg) {
  lmsOrg = await LMSOrganization.create({
    name: 'LMS Learning System',
    bankAccount: {
      accountNumber: 'LMS001',
      balance: 1000000
    }
  });
  console.log('LMS Organization created');
}

seedData();