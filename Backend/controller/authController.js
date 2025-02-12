const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const Otp = require("../models/otp");
const bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // console.log("🔍 Received Login Request");
    // console.log("👉 Email/Username:", emailOrUsername);
    // console.log("👉 Password:", password);

    if (!User) {
      console.log("❌ User model is undefined!");
      return res
        .status(500)
        .json({ error: "Server error: User model not found" });
    }

    // Check if user exists
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    // console.log("🔍 Found User:", user);

    if (!user) {
      return res.status(401).json({ error: "❌ User not found" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    // console.log("🔍 Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "❌ Invalid password" });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login Successful, Token Generated");
    res.status(200).json({ token, user });
  } catch (err) {
    console.error("❌ Error in login route:", err);
    res.status(400).json({ error: err.message });
  }
};

const register = async (req, res) => {
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
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const otpEntry = await Otp.findOne({ email });

    if (!otpEntry) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user.password)

    // Hash the password before saving
    // user.password = await bcrypt.hash(newPassword, 10);
    user.password =  newPassword;
    await user.save();

    // Delete OTP entry after successful reset
    await Otp.deleteOne({ email });

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpEntry = await Otp.findOne({ email });

    if (!otpEntry || otpEntry.expiresAt < Date.now()) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    if (otpEntry.otp !== otp) {
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    // OTP verified, generate a reset token
    // const resetToken = crypto.randomBytes(32).toString("hex");

    // Update OTP entry with reset token
    // otpEntry.resetToken = resetToken;
    // await otpEntry.save();

    res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP (6-digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    // Check if OTP exists, update if found, else create a new one
    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) {
      existingOtp.otp = otp;
      existingOtp.expiresAt = expiresAt;
      await existingOtp.save();
    } else {
      await Otp.create({ email, otp, expiresAt });
    }

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
};

module.exports = { login, register, resetPassword, verifyOtp, forgotPassword };
