const express = require("express");
const router = express.Router();
const DeviceDataReadingsAlert = require("../modals/devicedatareadingsalerts"); // adjust path if needed

// GET /api/alerts → Get all alert entries from DeviceDataReadingsAlert
router.get("/alerts", async (req, res) => {
    // GET /api/alerts?limit=45
const limit = parseInt(req.query.limit) || 45;
const alerts = await DeviceDataReadingsAlert.find()
  .sort({ triggeredAt: -1 })
  .limit(limit);

  try {
    const alerts = await DeviceDataReadingsAlert.find()
      .sort({ triggeredAt: -1 }); // newest first

    if (!alerts.length) {
      return res.status(204).json({ message: "No alerts found." });
    }

    res.status(200).json(alerts);
  } catch (err) {
    console.error("❌ Error fetching alert data:", err.message);
    res.status(500).json({ error: "Internal server error while fetching alerts" });
  }
});

module.exports = router;
