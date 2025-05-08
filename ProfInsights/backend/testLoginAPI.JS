const axios = require('axios');

// Test the faculty login endpoint
async function testFacultyLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/faculty-login', {
      email: 'vivek@mahindrauniversity.edu.in',
      password: 'faculty123'
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Login failed!');
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

// Run the test
testFacultyLogin();