const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const Student = require('../models/Student');
const Professor = require('../models/Professor');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    // Check if token contains role identifier
    if (decoded.role === 'faculty') {
      // For faculty users
      req.user = await Professor.findById(decoded.id);
      req.user.role = 'faculty'; // Ensure role is set
    } else {
      // Default to student
      req.student = await Student.findById(decoded.id);
      req.user = req.student; // Set user for consistency
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if we have a user or student with appropriate role
    const userRole = req.user ? req.user.role : (req.student ? req.student.role : null);
    
    if (!userRole || !roles.includes(userRole)) {
      return next(
        new ErrorResponse(
          `Role "${userRole}" is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};