// const express = require("express");
// const router = express.Router();
// const DeviceDataReadingsAlert = require("../modals/devicedatareadingsalerts"); // adjust path if needed

// // GET /api/alerts → Get all alert entries from DeviceDataReadingsAlert
// router.get("/alerts", async (req, res) => {
//     // GET /api/alerts?limit=45
// const limit = parseInt(req.query.limit) || 45;
// const alerts = await DeviceDataReadingsAlert.find()
//   .sort({ triggeredAt: -1 })
//   .limit(limit);

//   try {
//     const alerts = await DeviceDataReadingsAlert.find()
//       .sort({ triggeredAt: -1 }); // newest first

//     if (!alerts.length) {
//       return res.status(204).json({ message: "No alerts found." });
//     }

//     res.status(200).json(alerts);
//   } catch (err) {
//     console.error("❌ Error fetching alert data:", err.message);
//     res.status(500).json({ error: "Internal server error while fetching alerts" });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const DeviceDataReadingsAlert = require("../modals/devicedatareadingsalerts");
const DeviceMaster = require("../modals/DeviceMaster");
const ClientDeviceMap = require("../modals/ClientDeviceMap"); // ⬅️ Don't forget to import this

// GET /api/alerts → Get only alerts for devices mapped to a client
router.get("/alerts", async (req, res) => {
  const limit = parseInt(req.query.limit) || 45;
  const { clientId } = req.query; // 🧠 Receive clientId from query

  if (!clientId) {
    return res.status(400).json({ error: "Missing clientId in request" });
  }

  try {
    // Step 1: Fetch all device mappings for this client
    const mappings = await ClientDeviceMap.find({ clientId })
      .populate("deviceId", "deviceID name"); // get deviceID and name

    if (!mappings.length) {
      return res.status(200).json([]); // no devices mapped
    }

    const deviceIDs = mappings.map(m => m.deviceId.deviceID);

    console.log("✅ Allowed Device IDs for Client:", deviceIDs);

    // Step 2: Fetch alerts only for mapped devices
    const alerts = await DeviceDataReadingsAlert.find({ deviceID: { $in: deviceIDs } })
      .sort({ triggeredAt: -1 })
      .limit(limit);

    if (!alerts.length) {
      return res.status(204).json({ message: "No alerts found for this client." });
    }

    // Step 3: Build a deviceID → name map
    const deviceIdToNameMap = {};
    mappings.forEach(m => {
      if (m.deviceId) {
        deviceIdToNameMap[m.deviceId.deviceID] = m.deviceId.name;
      }
    });

    // Step 4: Replace deviceID with deviceName
    const alertsWithDeviceName = alerts.map(alert => {
      const alertObj = alert.toObject();
      alertObj.deviceName = deviceIdToNameMap[alert.deviceID] || "Unknown Device";
      delete alertObj.deviceID; // optional: remove deviceID if not needed
      return alertObj;
    });

    res.status(200).json(alertsWithDeviceName);
  } catch (err) {
    console.error("❌ Error fetching client-specific alerts:", err.message);
    res.status(500).json({ error: "Internal server error while fetching alerts" });
  }
});

module.exports = router;
