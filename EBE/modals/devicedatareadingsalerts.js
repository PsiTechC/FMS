const mongoose = require("mongoose");

const deviceAlertSchema = new mongoose.Schema({
  deviceID: {
    type: String,
    required: true
  },
  alertType: {
    type: String,
    enum: [
      "red",
      "orange",
      "yellow",
      "device disconnected",
      "back online",
      "error"
    ],
    required: true
  },
  waterLevel: {
    type: Number,
    required: function () {
      return ["red", "orange", "yellow"].includes(this.alertType);
    }
  },
  triggeredAt: {
    type: Date,
    default: Date.now
  },

});

module.exports = mongoose.model("DeviceDataReadingsAlert", deviceAlertSchema);
