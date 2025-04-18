const mongoose = require("mongoose");

const clientMasterSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true }, // ✅ ADD THIS
  address: {
    building: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, "Phone number should be 10 digits"],
  },
  created_at: { type: Date, default: Date.now },
  created_by: { type: String, default: "system" },
  modified_at: { type: Date, default: Date.now },
  modified_by: { type: String, default: "system" },
});

const ClientMaster = mongoose.model("ClientMaster", clientMasterSchema, "clientmasters");

module.exports = ClientMaster;