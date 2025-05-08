const mongoose = require('mongoose');
const Professor = require('../models/Professor');

// Use the correct lowercase database name
const mongoURI = 'mongodb+srv://sirivennela:Siri%402005@profinsights.vcsfydm.mongodb.net/profinsights?retryWrites=true&w=majority&appName=ProfInsights';

// Faculty data with updated emails
const facultyData = [
  {
    name: 'Dr. Vivek Kumar Mishra',
    department: 'Finance',
    course: 'Computational Finance with Applications',
    code: 'CS3235',
    credits: 3,
    courses: ['Computational Finance with Applications'],
    email: 'vivek@mahindrauniversity.edu.in',
    reviewCount: 0,
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    }
  },
  {
    name: 'Veeraiah Talagondapati',
    department: 'Computer Science',
    course: 'Computer Networks',
    code: 'CS2202',
    credits: 4,
    courses: ['Computer Networks'],
    email: 'veeraiah@mahindrauniversity.edu.in',
    reviewCount: 0,
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    }
  },
  {
    name: 'Mr. Rahul Roy',
    department: 'AI/ML',
    course: 'Deep Neural Networks',
    code: 'CS3223',
    credits: 4,
    courses: ['Deep Neural Networks'],
    email: 'rahul@mahindrauniversity.edu.in',
    reviewCount: 0,
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    }
  },
  {
    name: 'Dr. Raghu Kishore Neelisetty',
    department: 'Cybersecurity',
    course: 'Information Security Risk Assessment and Assurance',
    code: 'CS4179',
    credits: 3,
    courses: ['Information Security Risk Assessment and Assurance'],
    email: 'raghu@mahindrauniversity.edu.in',
    reviewCount: 0,
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    }
  },
  {
    name: 'Prof. Salome Benhur',
    department: 'Humanities',
    course: 'Introduction to Professional Development',
    code: 'HS3201',
    credits: 2,
    courses: ['Introduction to Professional Development'],
    email: 'salome@mahindrauniversity.edu.in',
    reviewCount: 0,
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    }
  },
  {
    name: 'Dr. Yajulu Medury',
    department: 'Humanities',
    course: 'Organizational Behaviour',
    code: 'HS3226',
    credits: 2,
    courses: ['Organizational Behaviour'],
    email: 'yajulu@mahindrauniversity.edu.in',
    reviewCount: 0,
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    }
  },
  {
    name: 'Mrs. Sowmini Devi Veeramachaneni',
    department: 'Computer Science',
    course: 'Programming Workshop',
    code: 'CS3204',
    credits: 1,
    courses: ['Programming Workshop'],
    email: 'sowmini@mahindrauniversity.edu.in',
    reviewCount: 0,
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    }
  },
  {
    name: 'Dr. Vijay Rao Duddu',
    department: 'Computer Science',
    course: 'Software Engineering',
    code: 'CS3201',
    credits: 3,
    courses: ['Software Engineering'],
    email: 'vijay@mahindrauniversity.edu.in',
    reviewCount: 0,
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    }
  }
];

// Connect to MongoDB with increased timeouts
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 60000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 60000,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully');
  importData();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Check that your IP is whitelisted in MongoDB Atlas');
  console.log('Verify that your connection string is correct');
  process.exit(1);
});

// Import function
const importData = async () => {
  try {
    console.log('Starting to import faculty data...');
    
    // Clear existing data
    console.log('Clearing existing professors...');
    await Professor.deleteMany({});
    console.log('Existing professors cleared');
    
    // Import new faculty data
    console.log('Importing new faculty data...');
    const insertedData = await Professor.insertMany(facultyData);
    
    console.log(`Success! ${insertedData.length} faculty profiles imported`);
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error during data import:');
    console.error(err);
    mongoose.connection.close();
    process.exit(1);
  }
};