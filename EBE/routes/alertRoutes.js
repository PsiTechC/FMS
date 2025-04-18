// const express = require("express");
// const router = express.Router();
// const DeviceData = require("../modals/DeviceMaster");
// const DeviceClientMap = require("../modals/ClientDeviceMap");

// // GET /api/alerts/live
// router.get("/alerts/live", async (req, res) => {
//   try {
//     const now = Date.now();
//     const devices = await DeviceData.find({});
//     const mappings = await DeviceClientMap.find({}).populate("deviceId");

//     const redAlerts = [];
//     const orangeAlerts = [];
//     const yellowAlerts = [];
//     const disconnected = [];
//     const backOnline = [];
//     const errors = [];

//     mappings.forEach((map) => {
//       const deviceID = map.deviceId.deviceID;
//       const deviceName = map.deviceId.name || deviceID;
//       const reading = devices.find(d => d.deviceID === deviceID);

//       if (!reading) return;

//       const { waterLevel, distance, temp, hum, timestamp } = reading;
//       const timeDiff = now - new Date(timestamp).getTime();

//       // Water Level Alerts
//       if (waterLevel >= 50) {
//         redAlerts.push({ deviceID, deviceName, waterLevel, distance });
//       } else if (waterLevel >= 40) {
//         orangeAlerts.push({ deviceID, deviceName, waterLevel, distance });
//       } else if (waterLevel >= 30) {
//         yellowAlerts.push({ deviceID, deviceName, waterLevel, distance });
//       }

//       // Device Errors
//       if (temp === 998 && hum === 998) {
//         errors.push({ deviceID, deviceName, temp, hum });
//       }

//       // Disconnected if >10 mins
//       if (timeDiff > 10 * 60 * 1000) {
//         disconnected.push({ deviceID, deviceName, lastSeen: timestamp });
//       }
//     });

//     // 🧠 Debug output
//     console.log("🚨 Error Devices:", errors);

//     res.json({
//       alerts: {
//         red: redAlerts,
//         orange: orangeAlerts,
//         yellow: yellowAlerts
//       },
//       connections: {
//         disconnected,
//         backOnline,
//         errors
//       }
//     });
//   } catch (err) {
//     console.error("❌ Failed to compute alerts:", err);
//     res.status(500).json({ error: "Server error fetching alerts." });
//   }
// });

// module.exports = router;

// routes/redAlerts.js
//---
// const express = require("express");
// const router = express.Router();
// const RedAlert = require("../modals/RedAlert"); // Your Mongoose model

// router.post("/redalerts", async (req, res) => {
//   console.log("📨 Incoming Red Alert:", req.body);
//   try {
//     const { deviceID, deviceName, waterLevel, distance } = req.body;
//     const newAlert = new RedAlert({
//       type: "Water level exceeding red alert",
//       timestamp: new Date(),
//       deviceID,
//       deviceName,
//       waterLevel,
//       distance,
//     });

//     await newAlert.save();
//     res.status(201).json({ message: "Red alert saved." });
//   } catch (err) {
//     console.error("❌ Error saving red alert:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Add this below your POST route
// router.get("/redalerts", async (req, res) => {
//   try {
//     const alerts = await RedAlert.find().sort({ timestamp: -1 }).limit(100); // latest 100
//     res.json(alerts);
//   } catch (err) {
//     console.error("❌ Error fetching red alerts:", err);
//     res.status(500).json({ error: "Failed to fetch red alerts" });
//   }
// });

// module.exports = router;

// For preview/testing only — won't store anything in MongoDB

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

