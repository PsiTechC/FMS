const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken"); 
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
    // ✅ Debug log to verify .env values
    console.log("ENV DB_USERNAME:", process.env.DB_USERNAME);
    console.log("ENV DB_PASSWORD:", process.env.DB_PASSWORD);

    // ✅ Admin check (simplified)
    const isAdmin = username === process.env.DB_USERNAME && password === process.env.DB_PASSWORD;

    if (isAdmin) {
      console.log(`[LOGIN] Admin '${username}' logged in.`);

      const token = jwt.sign(
        { role: "admin", username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token, role: "admin", username });
    }

    // ✅ Client check
    const client = await Client.findOne({ email: username });

    if (!client) {
      console.warn("Client not found for email:", username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: client._id, role: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      role: "client",
      clientId: client._id,
      username: client.username,
    });

  } catch (error) {
    console.error("🔥 Login error:", error.stack || error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
