const express = require("express");
const router = express.Router();
const { CreateOtp, VerifyOtp } = require("../controller/OtpController");



// routes here
router.route(`/request-otp`).post(CreateOtp);
router.route(`/verify-otp`).post(VerifyOtp);





module.exports = router
