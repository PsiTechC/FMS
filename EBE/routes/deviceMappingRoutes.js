// routes/deviceMappingRoutes.js
const express = require("express");
const router = express.Router();
const ClientDeviceMap = require("../modals/ClientDeviceMap");

const ClientMaster = require("../modals/ClientMaster");
const DeviceMaster = require("../modals/DeviceMaster");

// ✅ GET Mappings
router.get("/mappings", async (req, res) => {
  try {
    const mappings = await ClientDeviceMap.find()
      .populate("clientId", "username")
      .populate("deviceId", "name");

    res.status(200).json(mappings);
  } catch (error) {
    console.error("Error fetching mappings:", error);
    res.status(500).json({ message: "Error fetching mappings" });
  }
});

// ✅ POST Mapping
router.post("/map-devices", async (req, res) => {
  const { selectedClients, selectedDevices } = req.body;

  console.log("✅ Received Clients:", selectedClients);
  console.log("✅ Received Devices:", selectedDevices);

  if (!selectedClients?.length || !selectedDevices?.length) {
    return res.status(400).json({ message: "Clients and devices are required" });
  }

  try {
    // 🔍 Filter out invalid IDs (just in case)
    const validClients = selectedClients.filter(Boolean);
    const validDevices = selectedDevices.filter(Boolean);

    // 🛡 Check if any selected device is already mapped
    const alreadyMappedDevices = await ClientDeviceMap.find({
      deviceId: { $in: validDevices }
    });

    const mappedDeviceIds = new Set(alreadyMappedDevices.map(m => m.deviceId.toString()));

    // ⛏ Prepare mappings only for unmapped devices
    const mappings = [];

    validClients.forEach(clientId => {
      validDevices.forEach(deviceId => {
        if (
          clientId &&
          deviceId &&
          !mappedDeviceIds.has(deviceId.toString())
        ) {
          mappings.push({ clientId, deviceId });
        }
      });
    });

    if (mappings.length === 0) {
      return res.status(400).json({ message: "All selected devices are already mapped to other clients" });
    }

    console.log("📝 Final mappings:", mappings);

    const result = await ClientDeviceMap.insertMany(mappings);
    res.status(201).json({ message: "Devices mapped successfully", result });

  } catch (error) {
    console.error("❌ Mapping error:", error);
    res.status(500).json({ message: "Mapping failed", error });
  }
});



module.exports = router;
