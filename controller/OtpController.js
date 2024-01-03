const asyncHandler = require("express-async-handler");
const { OtpModel } = require("../model/OtpModel");
// const twilio = require("twilio");
const SendEmail = require("../utils/SendEmail");


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


const CreateOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const otp = generateOTP()


        const message = `Your Poolyfi App OTP code is: ${otp}. This code is valid for a short period and is used for account verification.`;


        const data = OtpModel({
            email: email,
            code: otp
        })


        await data.save()

        await SendEmail({
            email: email,
            subject: 'Poolyfi App OTP',
            message,
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully.' });

    } catch (error) {
        console.error('Error generating and sending OTP:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};




// verify otp here
const VerifyOtp = asyncHandler(async (req, res) => {
    const { code, email } = req.body;
    try {
        // Check if OTP is valid
        const otp = await OtpModel.findOne({ code });

        if (otp) {
            // OTP is valid, delete it from the database
            await OtpModel.deleteOne({ code });

            const message = `"Your OTP has been successfully verified, ensuring a secure login experience on the Poolyfi App. Welcome back!"`

            await SendEmail({
                email: email,
                subject: `The Poolyfi App OTP`,
                message
            })

            res.status(200).json({ success: true, message: 'OTP verified successfully. Email sent.' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }
    } catch (error) {
        console.error('Error generating and sending OTP:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});



module.exports = { CreateOtp, VerifyOtp }