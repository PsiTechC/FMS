// routes/ForAdmin.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();

const Client = require("../modals/ClientMaster");

// ✅ Optional: support multiple admins (comma-separated in .env)
const admins = process.env.ADMINS?.split(",") || [];

// ✅ Admin-only route (test)
router.get("/admin-test", (req, res) => {
  res.send("Admin test route working!");
});

// ✅ Admin login (legacy if needed)
router.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.DB_USERNAME && password === process.env.DB_PASSWORD) {
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// ✅ Combined Universal Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // 🔒 Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // 1️⃣ Admin Check
    const isAdminUser = admins.includes(username) || username === process.env.DB_USERNAME;

    if (isAdminUser && password === process.env.DB_PASSWORD) {
      console.log(`[LOGIN] Admin '${username}' logged in.`);
      return res.status(200).json({ role: "admin" });
    }

    // 2️⃣ Client Check
    const client = await Client.findOne({ username });

if (client) {
  if (client.password) {
    const isMatch = await bcrypt.compare(password, client.password);

    if (isMatch) {
      return res.status(200).json({
        role: "client",
        clientId: client._id,
        username: client.username,
      });
    } else {
      console.warn(`[LOGIN] Incorrect password for user: ${username}`);
      return res.status(401).json({ error: "Invalid username or password" });
    }
  } else {
    console.warn(`[LOGIN] No password set for client: ${username}`);
    return res.status(401).json({ error: "Invalid login data" });
  }
}

    // ❌ No match found
    console.warn(`[LOGIN FAILED] Username '${username}' failed to login.`);
    return res.status(401).json({ error: "Invalid username or password" });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
