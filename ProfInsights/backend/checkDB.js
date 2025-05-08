// Create a file called checkDB.js with this content:
const mongoose = require('mongoose');
const Professor = require('./models/Professor');

const mongoURI = 'mongodb+srv://sirivennela:Siri%402005@profinsights.vcsfydm.mongodb.net/profinsights?retryWrites=true&w=majority&appName=ProfInsights';

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Check if any professors exist
    const count = await Professor.countDocuments();
    console.log(`Total professors in database: ${count}`);
    
    // Look for specific professor
    const professor = await Professor.findOne({ email: 'vivek@mahindrauniversity.edu.in' });
    
    if (professor) {
      console.log('Found professor:', professor);
    } else {
      console.log('Professor with email vivek@mahindrauniversity.edu.in not found');
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });