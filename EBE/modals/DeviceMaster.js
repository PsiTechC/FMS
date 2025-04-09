const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  deviceID: { type: String, unique: true }, // No default
  name: { type: String, required: true },
  description: { type: String, default: "" },
  location: { type: String, default: "" },  // ✅ Added location field
  isEnabled: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  isFaulty: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

const DeviceMaster = mongoose.model("DeviceMaster", deviceSchema, "devicemasters");
module.exports = DeviceMaster;
