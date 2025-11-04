// models/Otp.js
const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  expireAt: { type: Date, required: true, expires: 600 }, // 10 min TTL
});

OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });


const Otp = mongoose.model("Otp", OtpSchema);
module.exports=Otp
