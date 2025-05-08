const mongoose = require('mongoose');
const Professor = require('./models/Professor');

const email = 'vivek@mahindrauniversity.edu.in';
const password = 'faculty123';

async function debugFacultyLogin() {
  try {
    // Log the MongoDB connection string
    console.log('Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://sirivennela:Siri%402005@profinsights.vcsfydm.mongodb.net/profinsights?retryWrites=true&w=majority&appName=ProfInsights');
    console.log('✅ Connected to MongoDB successfully');
    
    // Get all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Collections in database:');
    collections.forEach(coll => console.log(`- ${coll.name}`));
    
    // Check the model name and collection
    console.log('\n📋 Checking Professor model:');
    console.log('Model name:', Professor.modelName);
    console.log('Collection name:', Professor.collection.collectionName);
    
    // Try to find professor with exact email match
    console.log(`\n🔍 Looking for professor with email: "${email}"`);
    const professorExact = await Professor.findOne({ email });
    
    if (professorExact) {
      console.log('✅ FOUND PROFESSOR with exact match:', professorExact.name);
      console.log('Professor details:', {
        _id: professorExact._id.toString(),
        name: professorExact.name,
        email: professorExact.email,
        department: professorExact.department
      });
    } else {
      console.log('❌ Professor NOT FOUND with exact email match');
    }
    
    // List all professors
    console.log('\n👥 All professors in the database:');
    const allProfessors = await Professor.find();
    allProfessors.forEach(prof => {
      console.log(`- ${prof.name} (${prof.email})`);
    });
    
    // Check if Professor model might be using a different collection name than expected
    // This is crucial - sometimes Mongoose can map to a different collection
    console.log('\n🧪 Testing collection name mapping:');
    
    const collectionsArray = collections.map(c => c.name);
    if (collectionsArray.includes('professors')) {
      console.log('Found "professors" collection in database');
      
      // Query directly from the professors collection
      const directResults = await mongoose.connection.db
        .collection('professors')
        .find({ email })
        .toArray();
      
      console.log(`Direct query results (${directResults.length}):`);
      directResults.forEach(r => console.log(`- ${r.name} (${r.email})`));
    }
    
    // Check if it might be using the singular form
    if (collectionsArray.includes('professor')) {
      console.log('Found "professor" collection in database');
      
      // Query directly from the professor collection
      const directResults = await mongoose.connection.db
        .collection('professor')
        .find({ email })
        .toArray();
      
      console.log(`Direct query results (${directResults.length}):`);
      directResults.forEach(r => console.log(`- ${r.name} (${r.email})`));
    }
    
    // Now simulate exactly what happens in the auth controller
    console.log('\n🔐 Simulating facultyLogin function:');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // This is similar to what's in your facultyLogin function
    const professor = await Professor.findOne({ email });
    
    if (!professor) {
      console.log('❌ ERROR: Professor not found with this email');
      console.log('This matches the error in your API: "You are not authorized to access the faculty portal"');
    } else {
      console.log('✅ Professor found:', professor.name);
      
      // Check password
      if (password === 'faculty123') {
        console.log('✅ Password matches!');
        console.log('Login should be successful');
      } else {
        console.log('❌ Password does not match');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

debugFacultyLogin();