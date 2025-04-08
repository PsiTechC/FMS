const express = require("express");
const router = express.Router();
const ClientMaster = require("../modals/ClientMaster");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Utility to generate a secure random password
function generatePassword(length = 10) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

// Mail transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

// ✅ POST /clients - Add new client
router.post("/clients", async (req, res) => {
  try {
    const { email, address, phone } = req.body;

    // ✅ Check for duplicate email
    const existing = await ClientMaster.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Client with this email already exists" });
    }

    const username = email; // ✅ Use email as username
    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newClient = new ClientMaster({
      username,
      email,
      password: hashedPassword,
      address: {
        building: address.building || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "",
      },
      phone,
    });

    const savedClient = await newClient.save();

    // ✅ Send email with login info
    const loginUrl = "http://localhost:3000";
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Your FMS Login Credentials",
      html: `
        <h3>Welcome to FMS!</h3>
        <p>Your account has been created. Below are your login credentials:</p>
        <ul>
          <li><strong>Username:</strong> ${email}</li>
          <li><strong>Password:</strong> ${rawPassword}</li>
        </ul>
        <p>You can log in here:</p>
        <a href="${loginUrl}" style="display: inline-block; padding: 8px 12px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Go to Login Page</a>
        <p><small>Please keep your credentials safe.</small></p>
        <br />
        <p>– FMS Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Client saved and credentials sent via email", client: savedClient });

  } catch (error) {
    console.error("Error saving client:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ GET /clients
router.get("/clients", async (req, res) => {
  try {
    const clients = await ClientMaster.find().sort({ username: 1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

module.exports = router;
