const express = require('express');
const router = express.Router();
const {
  loginWithPassword,
  sendOTP,
  verifyOTP,
  registerVolunteer,
  loginVolunteer,
  registerByAdmin,
  getMe,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', loginWithPassword);              // Admin, Employee, Driver
router.post('/otp/send', sendOTP);                     // Donor OTP request
router.post('/otp/verify', verifyOTP);                 // Donor OTP verify
router.post('/volunteer/register', registerVolunteer); // Volunteer self-register
router.post('/volunteer/login', loginVolunteer);       // Volunteer login

// Protected routes
router.get('/me', protect, getMe);                     // Get current user

// Admin-only: create driver or employee account
router.post('/admin/register-user', protect, authorize('admin'), registerByAdmin);

module.exports = router;
