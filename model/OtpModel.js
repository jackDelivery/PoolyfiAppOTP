const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define OTP Schema
const OtpSchema = new Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create OTP Model
const OtpModel = mongoose.model("OTP", OtpSchema);

module.exports = { OtpModel };