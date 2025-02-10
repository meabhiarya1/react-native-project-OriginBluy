const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");
require("dotenv").config();

const router = express.Router();

const otpStorage = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Generate OTP and send email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP (6-digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP temporarily
    otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!otpStorage[email] || otpStorage[email].expiresAt < Date.now()) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    if (otpStorage[email].otp !== otp) {
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    // OTP verified, generate a temporary reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    otpStorage[email].resetToken = resetToken;

    res.status(200).json({ message: "OTP verified", resetToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword, resetToken } = req.body;

  try {
    if (!otpStorage[email] || otpStorage[email].resetToken !== resetToken) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clear OTP and token
    delete otpStorage[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register Route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, username, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ error: "Invalid email/username or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
