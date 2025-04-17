const express = require("express");
const router = express.Router();

const DeviceMaster = require("../modals/DeviceMaster");
const waterLevelData = require("../mqtt"); // Adjust path if needed

// Endpoint to send water level data to frontend
router.get("/water-data", (req, res) => {
  res.json(waterLevelData);
});

module.exports = router;

// Independent helper (same logic, different purpose)
async function generateNextDeviceCode() {
  const lastDevice = await DeviceMaster.findOne().sort({ created_at: -1 });

  if (!lastDevice || !lastDevice.deviceID) {
    return "FMS00001";
  }

  const lastNum = parseInt(lastDevice.deviceID.replace("FMS", ""), 10);
  const incremented = lastNum + 1;
  const paddedCode = String(incremented).padStart(5, "0");

  return `FMS${paddedCode}`;
}

// Example route using the above helper
router.get("/next-device-code", async (req, res) => {
  try {
    const nextCode = await generateNextDeviceCode();
    res.json({ deviceID: nextCode });
  } catch (err) {
    console.error("Failed to generate device code:", err);
    res.status(500).json({ message: "Error generating next device code" });
  }
});

module.exports = router;

