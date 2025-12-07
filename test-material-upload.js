const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5001/api';

async function testMaterialUpload() {
  console.log('Testing Material Upload System...\n');

  try {
    // 1. Login as instructor
    console.log('1. 🔑 Login as instructor...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'testinstructor@example.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('✅ Login successful\n');

    // 2. Get or create a course
    console.log('2. 📚 Get existing course...');
    const coursesRes = await axios.get(`${BASE_URL}/courses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    let courseId = coursesRes.data.data.courses[0]._id;
    console.log('✅ Using course:', coursesRes.data.data.courses[0].title, `(${courseId})\n`);

    // 3. Add a new section
    console.log('3. 📂 Add new section...');
    const sectionRes = await axios.post(`${BASE_URL}/materials/${courseId}/sections`, {
      title: 'Introduction to Web Development',
      description: 'Learn the basics of web development'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const sectionId = sectionRes.data.data.section._id;
    console.log('✅ Section added:', sectionRes.data.data.section.title, `(${sectionId})\n`);

    // 4. Add text material
    console.log('4. 📝 Add text material...');
    const textRes = await axios.post(`${BASE_URL}/materials/${courseId}/sections/${sectionId}/text`, {
      title: 'What is HTML?',
      content: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser...',
      duration: 10
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Text material added:', textRes.data.data.material.title, '\n');

    // 5. Add video material (create a dummy video file for testing)
    console.log('5. 🎥 Add video material...');
    
    // Create a dummy video file (you can skip this if you have actual video files)
    const dummyVideoPath = path.join(__dirname, 'test-video.mp4');
    if (!fs.existsSync(dummyVideoPath)) {
      console.log('⚠️  No test video file found. Creating dummy file...');
      fs.writeFileSync(dummyVideoPath, 'Dummy video content');
    }

    const formData = new FormData();
    formData.append('video', fs.createReadStream(dummyVideoPath));
    formData.append('title', 'HTML Basics Tutorial');
    formData.append('duration', 15);

    const videoRes = await axios.post(
      `${BASE_URL}/materials/${courseId}/sections/${sectionId}/video`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      }
    );
    console.log('✅ Video material added:', videoRes.data.data.material.title, '\n');

    // 6. Add audio material
    console.log('6. 🎵 Add audio material...');
    
    const dummyAudioPath = path.join(__dirname, 'test-audio.mp3');
    if (!fs.existsSync(dummyAudioPath)) {
      console.log('⚠️  No test audio file found. Creating dummy file...');
      fs.writeFileSync(dummyAudioPath, 'Dummy audio content');
    }

    const audioFormData = new FormData();
    audioFormData.append('audio', fs.createReadStream(dummyAudioPath));
    audioFormData.append('title', 'Audio Lecture: CSS Fundamentals');
    audioFormData.append('duration', 20);

    const audioRes = await axios.post(
      `${BASE_URL}/materials/${courseId}/sections/${sectionId}/audio`,
      audioFormData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...audioFormData.getHeaders()
        }
      }
    );
    console.log('✅ Audio material added:', audioRes.data.data.material.title, '\n');

    // 7. Add MCQ material
    console.log('7. ❓ Add MCQ material...');
    const mcqRes = await axios.post(`${BASE_URL}/materials/${courseId}/sections/${sectionId}/mcq`, {
      title: 'HTML Quiz',
      duration: 5,
      questions: [
        {
          question: 'What does HTML stand for?',
          options: [
            'Hyper Text Markup Language',
            'High Tech Modern Language',
            'Hyper Transfer Markup Language',
            'Home Tool Markup Language'
          ],
          correctAnswer: 0,
          explanation: 'HTML stands for Hyper Text Markup Language.'
        },
        {
          question: 'Which tag is used for the largest heading?',
          options: ['<h6>', '<h1>', '<head>', '<header>'],
          correctAnswer: 1,
          explanation: '<h1> is used for the largest heading.'
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ MCQ material added:', mcqRes.data.data.material.title, '\n');

    // 8. Get all materials
    console.log('8. 📋 Get all course materials...');
    const materialsRes = await axios.get(`${BASE_URL}/materials/${courseId}/materials`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const course = materialsRes.data.data.course;
    console.log('✅ Materials retrieved successfully!');
    console.log('Course:', course.title);
    console.log('Total sections:', course.sections.length);
    
    course.sections.forEach((section, index) => {
      console.log(`\nSection ${index + 1}: ${section.title}`);
      console.log('Materials:', section.materials.length);
      section.materials.forEach((material, mIndex) => {
        console.log(`  ${mIndex + 1}. ${material.type.toUpperCase()}: ${material.title} (${material.duration} mins)`);
      });
    });

    console.log('\n🎉 MATERIAL UPLOAD SYSTEM TEST COMPLETED SUCCESSFULLY!');
    console.log('\n📁 Files are stored in:');
    console.log('  - Video files: uploads/videos/');
    console.log('  - Audio files: uploads/audios/');
    console.log('  - PDF files: uploads/pdfs/');
    console.log('  - Images: uploads/images/');

  } catch (error) {
    console.log('\n❌ Error:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.log('Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Install required packages first
console.log('Installing required packages...');
const { execSync } = require('child_process');
try {
  execSync('npm install form-data', { stdio: 'inherit' });
} catch (e) {
  console.log('form-data is already installed or installation failed');
}

testMaterialUpload();