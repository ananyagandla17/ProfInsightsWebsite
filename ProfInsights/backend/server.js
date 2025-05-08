const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

// Debug: Output NODE_ENV
console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`.cyan);

// Load env vars
dotenv.config({ path: './config/config.env' });

// Debug: Output MongoDB URI
console.log(`MongoDB URI: ${process.env.MONGO_URI || 'Not set in config'}`.cyan);

// Connect to database
connectDB();
console.log('Database connection initiated'.green);

// Try to load Professor model for debugging
try {
  const Professor = require('./models/Professor');
  console.log(`Professor model loaded successfully`.green);
  console.log(`Professor collection name: ${Professor.collection.collectionName}`.green);
} catch (err) {
  console.log(`Error loading Professor model: ${err.message}`.red);
}

// Route files
const auth = require('./routes/auth');
const professors = require('./routes/professors');
const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());
console.log('Body parser middleware registered'.cyan);

// Debug middleware for all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`.gray);
  next();
});

// Special debug middleware for faculty login
app.use('/api/auth/faculty-login', (req, res, next) => {
  console.log('----------------');
  console.log('FACULTY LOGIN REQUEST RECEIVED'.yellow.bold);
  console.log('Headers:', JSON.stringify(req.headers, null, 2).gray);
  console.log('Body:', JSON.stringify(req.body, null, 2).yellow);
  console.log('----------------');
  next();
});

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/professors', professors);
app.use('/api/reviews', reviews);

// Debug middleware after routes (to catch errors before errorHandler)
app.use((err, req, res, next) => {
  console.log('Error before errorHandler:'.red, err);
  next(err);
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});