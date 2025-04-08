const express = require("express");
const router = express.Router();
const DeviceMaster = require("../modals/DeviceMaster");

// POST /api/devices - Save new device
router.post("/devices", async (req, res) => {
  try {
    const { name, description } = req.body;

    const newDevice = new DeviceMaster({ name, description });
    const savedDevice = await newDevice.save();

    res.status(201).json({ message: "Device saved successfully", device: savedDevice });
  } catch (error) {
    console.error("Error saving device:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ GET /api/devices - Fetch all devices
router.get("/devices", async (req, res) => {
  try {
    const devices = await DeviceMaster.find().sort({ name: 1 }); // sorted alphabetically
    res.status(200).json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
});

module.exports = router;
