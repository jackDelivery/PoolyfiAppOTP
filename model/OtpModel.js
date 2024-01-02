const mongoose = require("mongoose");
const { Schema } = mongoose;


const OptSchema = new Schema({
    email: String,
    code: String,
    createdAt: { type: Date, expires: 300, default: Date.now } // OTP expires in 5 minutes (300 seconds)
})




const OtpModel = mongoose.model("OTP", OptSchema);


module.exports = { OtpModel }