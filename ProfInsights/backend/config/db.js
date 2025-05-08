const mongoose = require('mongoose');

// MongoDB Atlas connection URI (Ensure password is URL-encoded)
const dbURI = 'mongodb+srv://sirivennela:Siri%402005@profinsights.vcsfydm.mongodb.net/ProfInsights?retryWrites=true&w=majority&appName=ProfInsights';

// Function to connect to the database
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    return connection;  // Return connection object
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Export the connection function
module.exports = connectDB;
