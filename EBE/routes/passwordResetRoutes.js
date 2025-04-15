// ✅ Backend: routes/passwordResetRoutes.js
const express = require("express");
const router = express.Router();
const Client = require("../modals/ClientMaster");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Temporary store for OTPs (can be moved to Redis/DB if needed)
const otpStore = new Map(); // key: clientId, value: { otp, expiresAt }

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.ADMIN_EMAIL,
//     pass: process.env.ADMIN_EMAIL_PASSWORD,
//   },
// });

const transporter = nodemailer.createTransport({
  host: "mail.means.co.in",
  port: 587,
  secure: false,           // STARTTLS
  auth: {
    user: process.env.OF_USER,
    pass: process.env.OF_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// const transporter = nodemailer.createTransport({
//     host: "mail.eulerianbots.com", // ✅ replace with your actual SMTP host if different
//     port: 587,
//     secure: false, // true for port 465, false for 587
//     auth: {
//       user: process.env.EMAIL_USER,      // e.g., connect@eulerianbots.com
//       pass: process.env.EMAIL_PASS       // from your .env file
//     },
//     tls: {
//       rejectUnauthorized: false // Only if self-signed certificate
//     }
//   });

  

transporter.verify((err, success) => {
    if (err) {
      console.error("❌ Transporter verification failed:", err);
    } else {
      console.log("✅ Transporter is ready to send messages");
    }
  });
  

// ✅ Step 1: Send OTP
router.post("/send-otp", async (req, res) => {
  const { clientId } = req.body;

  try {
    const client = await Client.findById(clientId);
    if (!client || !client.email) return res.status(404).json({ error: "Client not found or no email." });

    const existingOtp = otpStore.get(clientId);
    if (existingOtp && Date.now() < existingOtp.expiresAt) {
      return res.json({ message: "OTP already sent. Please check your email." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 1 * 60 * 1000; // 10 mins

    otpStore.set(clientId, { otp, expiresAt });

    await transporter.sendMail({
      from: process.env.OF_USER,

      to: client.email,
      subject: "Your OTP for Password Reset",
      text: `Use this OTP to reset your password: ${otp}`,
    });

    // await transporter.sendMail({
    //     from: `"FMS Team" <${process.env.ADMIN_EMAIL}>`,
    //     to: "recipient@example.com",
    //     subject: "Test Email from FMS",
    //     text: "Hello! This is a test email from FMS.",
    //     html: "<b>Hello!</b> This is a test email from FMS."
    //   });

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ✅ Step 2: Verify OTP and Reset Password
router.post("/reset-password", async (req, res) => {
  const { clientId, otp, newPassword, confirmPassword } = req.body;

  const entry = otpStore.get(clientId);
  

  if (!entry) return res.status(400).json({ error: "OTP not found. Request a new one." });
  if (Date.now() > entry.expiresAt) return res.status(400).json({ error: "OTP expired." });
  if (entry.otp !== otp) return res.status(400).json({ error: "Invalid OTP." });
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: "Password too short." });
  if (newPassword !== confirmPassword) return res.status(400).json({ error: "Passwords do not match." });

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await Client.findByIdAndUpdate(clientId, { password: hashed });
    otpStore.delete(clientId);
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update password." });
  }
});

module.exports = router;
