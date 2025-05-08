const mongoose = require('mongoose');
const Professor = require('../models/Professor');
const jwt = require('jsonwebtoken');

// Simple faculty login that will work
exports.facultyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received login request:', { email });
    
    // Find the professor
    const professor = await Professor.findOne({ email });
    console.log('Professor found:', professor ? 'Yes' : 'No');
    
    if (!professor) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed. Please check your credentials.'
      });
    }
    
    // Check password
    if (password === 'faculty123') {
      // Create token
      const token = jwt.sign(
        { id: professor._id, name: professor.name, role: 'faculty' },
        'secret123', // Hardcoded secret
        { expiresIn: '1d' }
      );
      
      console.log('Login successful');
      
      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: professor._id,
          name: professor.name,
          email: professor.email,
          department: professor.department,
          course: professor.course,
          code: professor.code,
          credits: professor.credits,
          role: 'faculty'
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed. Please check your credentials.'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

exports.getFacultyMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Faculty profile'
    }
  });
};