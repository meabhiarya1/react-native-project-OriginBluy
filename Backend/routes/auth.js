require("dotenv").config();
const express = require("express");
const {
  login,
  register,
  resetPassword,
  verifyOtp,
  forgotPassword,
} = require("../controller/authController");

const router = express.Router();

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// Generate OTP and send email
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
