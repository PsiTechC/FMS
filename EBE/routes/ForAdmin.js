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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username);

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
  
    const client = await Client.findOne({ email: username });

    if (!client) {
      console.warn("Client not found for email:", username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({
      role: "client",
      clientId: client._id,
      username: client.username,
    });

  } catch (error) {
    console.error("🔥 Login error:", error.stack || error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router;
