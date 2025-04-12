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
    const devices = await DeviceMaster.find().sort({ created_at: 1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch devices" });
  }
});

// PUT /api/devices/:deviceID
router.put("/devices/:deviceID", async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await DeviceMaster.findOneAndUpdate(
      { deviceID: req.params.deviceID },
      { name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating device name:", err);
    res.status(500).json({ error: "Failed to update device name" });
  }
});

// router.get("/devices/client/:clientId", async (req, res) => {
//   const clientId = req.params.clientId;

//   try {
//     // Fetch the devices mapped to the client
//     const clientDevices = await ClientDeviceMap.findOne({ clientId });

//     if (!clientDevices) {
//       return res.status(404).send("Client not found or no devices mapped.");
//     }

//     // Get the device IDs of the mapped devices
//     const deviceIds = clientDevices.devices.map(device => device.deviceID);

//     // Fetch the device details from DeviceMaster based on the mapped device IDs
//     const devices = await DeviceMaster.find({ deviceID: { $in: deviceIds } });

//     // Send the devices as a response
//     res.json(devices);
//   } catch (err) {
//     console.error("Error fetching client devices:", err);
//     res.status(500).send("Error fetching client devices");
//   }
// });





module.exports = router;
