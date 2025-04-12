const express = require("express");
const router = express.Router();
const ClientDeviceMap = require("../modals/ClientDeviceMap");
const DeviceMaster = require("../modals/DeviceMaster");

router.get("/mappings/client/:clientId", async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const mappings = await ClientDeviceMap.find({ clientId })
      .populate("deviceId", "deviceID name description") // include useful device fields
      .populate("clientId", "username"); // optional

    res.status(200).json(mappings);
  } catch (error) {
    console.error("Error fetching client mappings:", error);
    res.status(500).json({ message: "Error fetching mappings" });
  }
});


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

// router.get("/mappings/client/:clientId", async (req, res) => {
//   const { clientId } = req.params;

//   try {
//     // Find mappings for the given clientId and populate the deviceId with name and location.
//     const mappings = await ClientDeviceMap.find({ clientId })
//       .populate("deviceId", "deviceID name location") // Populate deviceId with deviceID, name, and location
//       .select("deviceId"); // Only select the deviceId field from the mappings.

//     // Check if mappings exist for the client
//     if (!mappings.length) {
//       return res.status(404).json({ error: "No devices found for this client." });
//     }

//     // Return the populated device details
//     res.status(200).json(mappings.map(mapping => mapping.deviceId)); // Return only the populated deviceId fields

//   } catch (err) {
//     console.error("Error fetching mappings:", err);
//     res.status(500).json({ error: "Server error, unable to fetch mappings." });
//   }
// });

router.get("/mappings/client/:clientId", async (req, res) => {
  const { clientId } = req.params; // Extract clientId from request parameters

  try {
    // Find the mappings of devices for the given clientId and populate device details
    const mappings = await ClientDeviceMap.find({ clientId })
      .populate("deviceId", "deviceID name location") // Populate deviceId with deviceID, name, and location
      .select("deviceId"); // Only select the deviceId field from the mappings

    // If no mappings are found for this client
    if (!mappings.length) {
      return res.status(404).json({ error: "No devices found for this client." });
    }

    // Send back the populated device details
    res.status(200).json(mappings.map(mapping => mapping.deviceId)); // Send only the populated deviceId fields

  } catch (err) {
    console.error("Error fetching mapped devices:", err);
    res.status(500).json({ error: "Server error, unable to fetch mapped devices." });
  }
});

const mongoose = require("mongoose");

router.get("/devices/location/client/:clientId", async (req, res) => {
  const clientId = req.params.clientId;
  console.log("Fetching devices for client:", clientId);

  try {
    // Step 1: Find client device mappings
    const clientMappings = await ClientDeviceMap.find({ clientId: new mongoose.Types.ObjectId(clientId) });
    console.log("Client Mappings:", clientMappings);

    // Check if mappings exist
    if (!clientMappings || clientMappings.length === 0) {
      console.log("No devices mapped for this client.");
      return res.status(404).send("No devices mapped for this client.");
    }

    // Step 2: Extract device IDs
    const deviceIds = clientMappings.map(mapping => mapping.deviceId);
    console.log("Device IDs to fetch:", deviceIds);

    // Step 3: Fetch device details from DeviceMaster
    const devices = await DeviceMaster.find({ _id: { $in: deviceIds } });
    console.log("Devices found:", devices);

    // Send device data as response
    res.json(devices);
  } catch (err) {
    console.error("Error fetching client devices:", err);
    res.status(500).send("Error fetching client devices");
  }
});

module.exports = router;