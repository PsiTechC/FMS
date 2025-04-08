const express = require("express");
const router = express.Router();
const waterLevelData = require("../mqtt"); // Adjust path if needed

// Endpoint to send water level data to frontend
router.get("/water-data", (req, res) => {
  res.json(waterLevelData);
});

module.exports = router;
