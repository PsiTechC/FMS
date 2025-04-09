// routes/mqttRoutes.js
const express = require("express");
const router = express.Router();
const { getLatestDeviceData } = require("./mqtt_subscriber");

// GET /api/mqtt/latest → return all device data
router.get("/mqtt/latest", (req, res) => {
  const data = getLatestDeviceData();

  if (Object.keys(data).length === 0) {
    return res.status(204).json({ message: "No MQTT data received yet." });
  }

  res.status(200).json(data);
});

module.exports = router;
