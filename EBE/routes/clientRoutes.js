
// module.exports = router;

const express = require("express");
const router = express.Router();
const ClientMaster = require("../modals/ClientMaster");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const ClientDeviceMap = require("../modals/ClientDeviceMap");
const verifyToken = require("../middleware/verifyToken"); // adjust path as needed


// Utility to generate a secure random password
function generatePassword(length = 10) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

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
    user: "connect@means.co.in",
    pass: "Connect@2024",
  },
  tls: { rejectUnauthorized: false },
});

router.post("/clients", async (req, res) => {
  try {
    const { username, email, address, phone } = req.body;

    // ✅ Check for duplicate email
    const existing = await ClientMaster.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Client with this email already exists" });
    }

    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // ✅ Store actual username (not email) in DB
    const newClient = new ClientMaster({
      username, // from modal input
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

    // ✅ Use email as the login identifier in the email sent
    const loginUrl = "http://localhost:3000";
    const mailOptions = {
      from: process.env.OF_USER,
      to: email,
      subject: "Your FMS Login Credentials",
      html: `
        <h3>Welcome to FMS!</h3>
        <p>Your account has been created. Below are your login credentials:</p>
        <ul>
          <li><strong>Username:</strong> ${email}</li>  <!-- shown in mail only -->
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

router.delete("/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ClientMaster.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Failed to delete client" });
  }
});

// GET /clients/:id → get client by ID
router.get("/clients/:id", async (req, res) => {
  try {
    const client = await ClientMaster.findById(req.params.id).select("username"); // 🔍 Query MongoDB
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client); // ⬅️ This data is sent back to frontend
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Failed to fetch client" });
  }
});


module.exports = router;