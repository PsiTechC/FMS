const express = require("express");
const router = express.Router();
const RedAlert = require("../modals/RedAlert");

// Save red alert to MongoDB
router.post("/redalerts", async (req, res) => {
  try {
    const { deviceID, deviceName, waterLevel, distance, timestamp } = req.body;

    // ✅ Basic presence check
    if (
      !deviceID || typeof waterLevel !== "number" || typeof distance !== "number"
    ) {
      return res.status(400).json({ message: "❌ Missing or invalid fields" });
    }

    // ✅ Create alert document
    const redAlert = new RedAlert({
      deviceID,
      deviceName,
      waterLevel,
      distance,
      timestamp: timestamp || Date.now()
    });

    // ✅ Validate with Mongoose
    await redAlert.validate();

    // ✅ Save to DB
    await redAlert.save();

    res.status(201).json({
      message: "✅ Red alert saved",
      alert: redAlert
    });
  } catch (err) {
    console.error("❌ Failed to store red alert:", err);
    res.status(500).json({
      message: "❌ Internal error",
      error: err.message
    });
  }
});

module.exports = router;

