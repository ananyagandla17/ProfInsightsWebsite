const axios = require('axios');

async function testFacultyLoginEndpoint() {
  try {
    console.log('Testing faculty login endpoint...');
    
    // Define the request payload
    const payload = {
      email: 'vivek@mahindrauniversity.edu.in',
      password: 'faculty123'
    };
    
    console.log('Request payload:', payload);
    
    // Make the HTTP request with detailed configuration
    const response = await axios({
      method: 'post',
      url: 'http://localhost:5000/api/auth/faculty-login',
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      validateStatus: function (status) {
        // Accept all status codes to see the error response
        return true;
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Check if the response was successful
    if (response.status === 200 && response.data.success) {
      console.log('LOGIN SUCCESSFUL!');
      console.log('Token:', response.data.token);
    } else {
      console.log('LOGIN FAILED!');
      console.log('Error message:', response.data.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('Request error:', error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }
  }
}

testFacultyLoginEndpoint();