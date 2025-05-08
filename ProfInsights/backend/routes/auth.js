const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Faculty routes only - simplified
router.post('/faculty-login', authController.facultyLogin);
router.get('/faculty-me', authController.getFacultyMe);

// Add placeholders for other routes
router.post('/register', (req, res) => res.json({ success: true, message: 'Registration placeholder' }));
router.post('/login', (req, res) => res.json({ success: true, message: 'Login placeholder' }));
router.get('/logout', (req, res) => res.json({ success: true, message: 'Logout placeholder' }));
router.get('/me', (req, res) => res.json({ success: true, message: 'Get user placeholder' }));
router.get('/verify-email/:token', (req, res) => res.json({ success: true, message: 'Email verification placeholder' }));

module.exports = router;