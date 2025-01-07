const nodemailer = require("nodemailer");
const User = require("../models/User");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ajaymali8428@gmail.com",
    pass: "chzoglmwgylfrjlp",
  },
});
const verifyUser = async (req, res) => {
  const { email, otp } = req.body;
  let user = await User.findOne({ email: email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const info = await transporter.sendMail({
      to: email,
      subject: "Rock_Bishop: Email Verification",
      text: `Your OTP is ${otp}.`, // Fallback text for non-HTML email clients
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #4CAF50;">Email Verification</h2>
          <p>Dear User,</p>
          <p>Please use the OTP below to verify your email address:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #4CAF50;">${otp}</div>
          <p>This OTP is valid for 5 minutes. If you did not request this, you can safely ignore this email.</p>
          <p>Best regards,</p>
          <p>The Rock_Bishop Team</p>
        </div>
      `,
    });
    if (info.rejected && info.rejected.length > 0) {
      return res
        .status(401)
        .json({ success: false, message: "Email delivery failed." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: error.message || "Internal Server Error",
      });
  }
};

module.exports = { verifyUser };
