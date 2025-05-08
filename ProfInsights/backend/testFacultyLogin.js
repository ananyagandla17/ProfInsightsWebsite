const mongoose = require('mongoose');
const Professor = require('./models/Professor');

const mongoURI = 'mongodb+srv://sirivennela:Siri%402005@profinsights.vcsfydm.mongodb.net/profinsights?retryWrites=true&w=majority&appName=ProfInsights';

async function testFacultyLoginLogic() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
    
    // Test email and password
    const email = 'vivek@mahindrauniversity.edu.in';
    const password = 'faculty123';
    
    console.log(`Attempting to find professor with email: ${email}`);
    
    // Case-sensitive search as it would happen in the controller
    const professorExact = await Professor.findOne({ email: email });
    console.log('Professor found with exact match?', !!professorExact);
    
    // Case-insensitive search (sometimes MongoDB string comparison can be case-sensitive)
    const professorCaseInsensitive = await Professor.findOne({ 
      email: { $regex: new RegExp('^' + email + '$', 'i') } 
    });
    console.log('Professor found with case-insensitive match?', !!professorCaseInsensitive);
    
    // Print all professors for comparison
    const allProfessors = await Professor.find({}).select('name email');
    console.log('\nAll professors in the database:');
    allProfessors.forEach(prof => {
      console.log(`- ${prof.name} (${prof.email})`);
    });
    
    // Now test the authentication logic
    if (professorExact) {
      console.log('\nFound professor:', professorExact.name);
      
      // Simple password comparison like in your controller
      if (password === 'faculty123') {
        console.log('Password matched!');
        console.log('Authentication would be successful');
      } else {
        console.log('Password did not match');
      }
    } else {
      console.log('\nNo professor found with email:', email);
      console.log('This is why authentication is failing');
      
      // Check if there's an issue with email format
      if (allProfessors.some(p => p.email.toLowerCase() === email.toLowerCase())) {
        console.log('NOTE: Found a case-insensitive match - might be a case sensitivity issue');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

testFacultyLoginLogic();