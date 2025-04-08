const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  deviceID: String,
  waterLevel: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
