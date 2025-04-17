// models/RedAlert.js
const mongoose = require("mongoose");

const redAlertSchema = new mongoose.Schema({
  type: { type: String, default: "Water level exceeding red alert" },
  timestamp: { type: Date, default: Date.now },
  deviceID: String,
  deviceName: String,
  waterLevel: Number,
  distance: Number,
});

module.exports = mongoose.model("RedAlert", redAlertSchema);
