function validateDevicePayload(payload) {
    const requiredFields = [
      "deviceID", "distance", "waterLevel", "batteryVoltage",
      "solarVoltage", "temp", "hum", "batteryPercent", "alert", "sigDbm"
    ];
  
    for (let field of requiredFields) {
      if (!(field in payload)) {
        return { valid: false, error: `Missing field: ${field}` };
      }
    }
  
    // Optional: Type checks
    if (typeof payload.deviceID !== "string") return { valid: false, error: "deviceID must be a string" };
    if (typeof payload.distance !== "number") return { valid: false, error: "distance must be a number" };
    if (typeof payload.temp !== "number" || payload.temp === 998) return { valid: false, error: "invalid temp reading" };
    if (typeof payload.hum !== "number" || payload.hum === 998) return { valid: false, error: "invalid humidity reading" };
  
    return { valid: true };
  }
  
  module.exports = validateDevicePayload;
  