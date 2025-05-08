// Simple test to check exports from authController
const authController = require('./controllers/authController');

console.log('Auth controller loaded:');
console.log('Type:', typeof authController);
console.log('Is object?', authController !== null && typeof authController === 'object');

console.log('\nAvailable functions:');
for (const key in authController) {
  console.log(`- ${key}: ${typeof authController[key]}`);
}

console.log('\nSpecific functions:');
console.log('facultyLogin exists?', 'facultyLogin' in authController);
console.log('facultyLogin type:', typeof authController.facultyLogin);
console.log('login exists?', 'login' in authController);
console.log('login type:', typeof authController.login);