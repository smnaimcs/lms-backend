const mongoose = require('mongoose');
require('dotenv').config();

const testCourseCreation = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get models
    const User = require('./models/User');
    const Course = require('./models/Course');
    const LMSOrganization = require('./models/LMSOrganization');

    // Check if we have an instructor
    const instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.log('❌ No instructor found. Please run seed script first.');
      process.exit(1);
    }

    console.log('Using instructor:', instructor.name, `(${instructor.email})`);

    // Check LMS organization
    const lmsOrg = await LMSOrganization.findOne({});
    console.log('LMS Organization balance:', lmsOrg?.bankAccount?.balance);

    // Test course data
    const courseData = {
      title: "Web Development Fundamentals",
      description: "Learn the basics of web development with HTML, CSS, and JavaScript",
      price: 99,
      category: "Programming",
      materials: [
        {
          type: "video",
          title: "Introduction to HTML",
          content: "https://example.com/videos/html-intro",
          duration: 30
        }
      ]
    };

    console.log('\n📝 Testing course creation with data:');
    console.log(JSON.stringify(courseData, null, 2));

    // Test the course creation directly
    const course = await Course.create({
      ...courseData,
      instructor: instructor._id,
      instructorPayout: courseData.price * 0.7
    });

    console.log('\n✅ Course created successfully!');
    console.log('Course ID:', course._id);
    console.log('Course Title:', course.title);
    console.log('Instructor Payout:', course.instructorPayout);

    // Check instructor balance after course creation
    const updatedInstructor = await User.findById(instructor._id);
    console.log('\n💰 Instructor balance after course creation:', updatedInstructor.bankAccount.balance);

  } catch (error) {
    console.error('\n❌ Error creating course:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
    process.exit(0);
  }
};

testCourseCreation();   