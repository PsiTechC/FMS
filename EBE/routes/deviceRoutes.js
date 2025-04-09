const express = require("express");
const router = express.Router();
const DeviceMaster = require("../modals/DeviceMaster");

// Helper function to generate the next device ID
async function generateNextDeviceID() {
  const latest = await DeviceMaster.findOne().sort({ created_at: -1 });

  if (!latest || !latest.deviceID) {
    return "FMS00001";  // First device
  }
  const num = parseInt(latest.deviceID.replace("FMS", ""), 10);
  const nextNum = num + 1;
  const padded = String(nextNum).padStart(5, "0");  // <-- 5 digits now
  return `FMS${padded}`;
}


// POST route
router.post("/devices", async (req, res) => {
  try {
    const { name, description, location } = req.body;
    const deviceID = await generateNextDeviceID();
    const newDevice = new DeviceMaster({
      deviceID,
      name,
      description,
      location,
    });

    const saved = await newDevice.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving device:", err);
    res.status(500).json({ error: "Failed to save device" });
  }
});

// GET all devices
router.get("/devices", async (req, res) => {
  try {
    const devices = await DeviceMaster.find().sort({ created_at: -1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch devices" });
  }
});


module.exports = router;
