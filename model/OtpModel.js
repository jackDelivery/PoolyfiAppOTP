const mongoose = require("mongoose");
const { Schema } = mongoose;

const OptSchema = new Schema({
    email: String,
    code: String,
    createdAt: { type: Date, default: Date.now }
});

const OtpModel = mongoose.model("OTP", OptSchema);



module.exports = { OtpModel };
