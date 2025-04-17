const express = require("express");
const router = express.Router();
const DeviceDataReading = require("../modals/DeviceDataReading"); // adjust path if needed

// GET /api/alerts/live → Return the latest 45 alert readings
router.get("/alerts/live", async (req, res) => {
  try {
    const alerts = await DeviceDataReading.find({
      alert: { $nin: ["None", "none"] }  // exclude non-alerts
    })
    .sort({ timestamp: -1 })             // newest first
    .limit(45);                          // get first 45

    res.status(200).json(alerts);
  } catch (err) {
    console.error("❌ Error fetching live alerts:", err.message);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

module.exports = router;
