const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  resetToken: String,
  expiresAt: Date,
});

const OtpModel = mongoose.model("Otp", otpSchema);
