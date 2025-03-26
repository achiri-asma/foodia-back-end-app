const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true }, // Hashed OTP
  expiresAt: { type: Date, required: true }, // Expiration time
});

module.exports = mongoose.model("OTP", OTPSchema);
