const asysncHandler = require("express-async-handler");
const { OtpModel } = require("../model/OtpModel");
// const twilio = require("twilio");
const SendEmail = require("../utils/SendEmail");
const nodemailer = require("nodemailer");




// create controller
const CreateOtp = asysncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        // Generate a 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to MongoDB
        await OtpModel.create({ email, code: otpCode });

        // Send OTP via Nodemailer
        const message = `Your Poolyfi App OTP code is: ${otpCode}. This code is valid for a short period and is used for account verification.`;

        await sendEmail({
            email: email,
            subject: 'Poolyfi App OTP',
            message,
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully.' });

    } catch (error) {
        console.error('Error generating and sending OTP:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Function to send email using Nodemailer
const sendEmail = async ({ email, subject, message }) => {
    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'alizashahzad543@gmail.com', // Replace with your Gmail email
                pass: 'wqgickllzfuabkhl', // Replace with your Gmail password
            },
        });

        // Email content
        const mailOptions = {
            from: `"Poolyfi App OTP" alizashahzad543@gmail.com`,
            to: email,
            subject: subject,
            text: message,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow the error for higher-level handling
    }
};


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