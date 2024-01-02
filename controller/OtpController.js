const asysncHandler = require("express-async-handler");
const { OtpModel } = require("../model/OtpModel");
// const twilio = require("twilio");
const SendEmail = require("../utils/SendEmail");


// const twilioAccountSid = process.env.twilioAccountSid;
// const twilioAuthToken = process.env.twilioAuthToken;
// const twilioClient = twilio(twilioAccountSid, twilioAuthToken);
// const twilioPhoneNumber = process.env.twilioPhoneNumber;


// create controller
const CreateOtp = asysncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to MongoDB
        await OtpModel.create({ email, code: otpCode });

        // Send OTP via Twilio
        // await twilioClient.messages.create({
        //     body: `Your Rider App OTP code is: ${otpCode}`,
        //     to: phone,
        //     from: "+17038359615",
        // });

        const message = `The Poolyfi App OTP, ${otpCode} or One-Time Password, is an advanced authentication mechanism implemented to bolster the security of user accounts within the Poolyfi application ecosystem. This dynamic system generates a unique, time-sensitive code, delivered exclusively via email, providing an extra layer of verification during the login process.
        `

        await SendEmail({
            email: email,
            subject: `The Poolyfi App OTP`,
            message
        })

        res.status(200).json({ success: true, message: 'OTP sent successfully.' });

    } catch (error) {
        res.status(500).send(error)
    }
})


// verify otp here
const VerifyOtp = asysncHandler(async (req, res) => {
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

            await SendEmail({
                email: email,
                subject: `The Poolyfi App OTP Verified`,
                message
            })

            res.status(200).json({ success: true, message: 'OTP verified successfully. Email sent.' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});



module.exports = { CreateOtp, VerifyOtp }