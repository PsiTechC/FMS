const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  deviceID: { type: String, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  location: { type: String, default: "" }, 
  red: { type: Number, default: null },
orange: { type: Number, default: null },
yellow: { type: Number, default: null },

  isEnabled: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  isFaulty: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
}, { timestamps: true });;

const DeviceMaster = mongoose.model("DeviceMaster", deviceSchema, "devicemasters");
module.exports = DeviceMaster;
