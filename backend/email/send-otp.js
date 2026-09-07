const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Must be a 16-digit Google App Password
  },
});

exports.sendOtpEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP code",
      html: `<h2>Your OTP is: ${otp}</h2><p>This code is valid for 5 minutes.</p>`,
    });

    console.log(`OTP email sent successfully to ${email}`);
    return info;
  } catch (err) {
    console.error("Error sending OTP email:", err.message);
    throw new Error(`Email sending failed: ${err.message}`);
  }
};