const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");


const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport(
        smtpTransport({
            host: "smtp.forwardemail.net",
            service: "gmail",
            secure: false,
            auth: {
                user: "alizashahzad543@gmail.com",
                pass: "wqgickllzfuabkhl",
            },
        })
    );



    const mailOptions = {
        from: `"Poolyfi App Otp" alizashahzad543@gmail.com`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;