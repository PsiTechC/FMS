const mongoose = require("mongoose");

const deviceDataReadingSchema = new mongoose.Schema({
  deviceID: String,
  topic: String,
  distance: Number,
  waterLevel: Number,
  batteryVoltage: Number,
  solarVoltage: Number,
  temp: Number,
  hum: Number,
  batteryPercent: Number,
  alert: String,
  sigDbm: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DeviceDataReading", deviceDataReadingSchema);
