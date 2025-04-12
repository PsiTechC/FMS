// const mongoose = require("mongoose");

// const clientDeviceMapSchema = new mongoose.Schema({
//   clientId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "ClientMaster", // Make sure this matches your client model name
//     required: true
//   },
//   deviceId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "DeviceMaster", // Make sure this matches your device model name
//     required: true
//   },
//   created_at: { type: Date, default: Date.now }
// });

// const ClientDeviceMap = mongoose.model("ClientDeviceMap", clientDeviceMapSchema, "clientdevicemaps");

// module.exports = ClientDeviceMap;


// models/ClientDeviceMap.js
const mongoose = require("mongoose");

const clientDeviceMapSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientMaster", // Make sure this matches your client model name
    required: true
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeviceMaster", // Make sure this matches your device model name
    required: true
  },
  created_at: { type: Date, default: Date.now }
});

// Define the model
const ClientDeviceMap = mongoose.model("ClientDeviceMap", clientDeviceMapSchema, "clientdevicemaps");

// Export the model
module.exports = ClientDeviceMap;
