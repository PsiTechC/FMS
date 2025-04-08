const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const deviceSchema = new mongoose.Schema({
  deviceID: { type: String, default: () => uuidv4(), unique: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  isEnabled: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  isFaulty: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

const DeviceMaster = mongoose.model("DeviceMaster", deviceSchema, "devicemasters");
module.exports = DeviceMaster;
