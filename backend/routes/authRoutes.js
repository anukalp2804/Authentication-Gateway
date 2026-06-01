const express = require('express');
const router = express.Router();

const {
  register,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.get('/logout', logout); // Mapped cleanly to our JSON controller
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', getMe);

module.exports = router;