const axios = require('axios');

const testAPIStepByStep = async () => {
  const BASE_URL = 'http://localhost:5001/api';

  try {
    console.log('=== STEP 1: LOGIN ===');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'shoaeb@gmail.com',
      password: 'password123'
    });

    if (loginResponse.data.status === 'success') {
      console.log('✅ Login successful');
      const token = loginResponse.data.token;
      console.log('Token received:', token.substring(0, 50) + '...');
      console.log('User:', loginResponse.data.data.user);
      
      console.log('\n=== STEP 2: CHECK USER PROFILE ===');
      const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Profile access successful');
      console.log('User role:', profileResponse.data.data.user.role);
      console.log('Profile completed:', profileResponse.data.data.user.profileCompleted);
      
      console.log('\n=== STEP 3: CREATE COURSE ===');
      const courseData = {
        title: "Web Development Fundamentals - API Test",
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

      console.log('Sending course data:', JSON.stringify(courseData, null, 2));
      
      const courseResponse = await axios.post(`${BASE_URL}/courses`, courseData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Course creation response:');
      console.log(JSON.stringify(courseResponse.data, null, 2));

    } else {
      console.log('❌ Login failed:', loginResponse.data.message);
    }

  } catch (error) {
    console.log('\n❌ ERROR:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error message:', error.response.data.message);
      console.log('Full error:', JSON.stringify(error.response.data, null, 2));
      
      // Check if it's an authentication error
      if (error.response.status === 401) {
        console.log('\n🔐 AUTHENTICATION ISSUE:');
        console.log('- Check if token is being sent correctly');
        console.log('- Check if user has instructor role');
        console.log('- Check auth middleware');
      }
    } else {
      console.log('Error:', error.message);
    }
  }
};

testAPIStepByStep();