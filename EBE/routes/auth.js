const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Client = require("../modals/ClientMaster"); // your client schema

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Route to send OTP
router.post("/send-otp", verifyToken, async (req, res) => {
  try {
    const client = await Client.findById(req.user.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    client.otp = otp;
    client.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    await client.save();

    await transporter.sendMail({
      to: client.email,
      subject: "Your OTP for Password Reset",
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP send error:", error.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

module.exports = router;
