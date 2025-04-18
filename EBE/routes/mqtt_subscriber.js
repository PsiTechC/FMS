// // // mqtt_subscriber.js

// // const mqtt = require('mqtt');

// // // Public broker details (example: test.mosquitto.org)
// // const BROKER_URL = 'mqtt://test.mosquitto.org';
// // const BROKER_PORT = 1883;
// // const TOPIC = 'myTopic/waterData';

// // // Create client (no username/password for test.mosquitto.org)
// // const client = mqtt.connect(`${BROKER_URL}:${BROKER_PORT}`, {
// //   clientId: 'JavaScriptSub'
// // });

// // // Handle successful connection
// // client.on('connect', () => { 
// //   console.log('Connected successfully to broker.');
// //   // Subscribe to the specified topic
// //   client.subscribe(TOPIC, (err) => {
// //     if (!err) {
// //       console.log(`Subscribed to topic: ${TOPIC}`);
// //     } else {
// //       console.error('Subscription error:', err);
// //     }
// //   });
// // });

// // // Handle incoming messages
// // client.on('message', (topic, messageBuffer) => {
// //   const payloadStr = messageBuffer.toString();
// //   console.log(`\nTopic: ${topic}\nRaw Message: ${payloadStr}`);

// //   try {
// //     // Parse the JSON payload
// //     const data = JSON.parse(payloadStr);

// //     // Extract fields (adjust these to match your ESP32 payload)
// //     const deviceID        = data.deviceID;
// //     const distance        = data.distance;
// //     const waterLevel      = data.waterLevel;
// //     const batteryVoltage  = data.batteryVoltage;
// //     const solarVoltage    = data.solarVoltage;
// //     const temperature     = data.temp;
// //     const humidity        = data.hum;

// //     console.log('Parsed data:');
// //     console.log(`  deviceID:       ${deviceID}`);
// //     console.log(`  distance:       ${distance}`);
// //     console.log(`  waterLevel:     ${waterLevel}`);
// //     console.log(`  batteryVoltage: ${batteryVoltage}`);
// //     console.log(`  solarVoltage:   ${solarVoltage}`);
// //     console.log(`  temperature:    ${temperature}`);
// //     console.log(`  humidity:       ${humidity}`);
// //   } catch (e) {
// //     console.error('Error parsing JSON:', e);
// //   }
// // });

// // // Handle errors
// // client.on('error', (error) => {
// //   console.error('MQTT Error:', error);
// // });


// // mqtt_subscriber.js
// const mqtt = require("mqtt");

// // Broker details
// const BROKER_URL = "mqtt://test.mosquitto.org:1883";

// // Topics
// const TOPIC_1 = "Device1/waterDevice1";
// const TOPIC_2 = "Device2/waterDevice2";

// // Connect to broker
// const client = mqtt.connect(BROKER_URL);

// client.on("connect", () => {
//   console.log("Connected successfully to broker.");

//   // Subscribe to both topics
//   client.subscribe([TOPIC_1, TOPIC_2], (err, granted) => {
//     if (err) {
//       console.error("Subscription error:", err);
//     } else {
//       console.log(`Subscribed to topics: ${TOPIC_1} and ${TOPIC_2}`);
//     }
//   });
// });

// client.on("message", (topic, message) => {
//   const payloadStr = message.toString();
//   console.log(`\nTopic: ${topic}\nRaw Message: ${payloadStr}`);

//   try {
//     const data = JSON.parse(payloadStr);

//     const {
//       deviceID,
//       distance,
//       waterLevel,
//       batteryVoltage,
//       solarVoltage,
//       temp,
//       hum,
//       batteryPercent,
//       alert,
//       sigDbm
//     } = data;

//     console.log("Parsed data:");
//     console.log(`  Device ID:      ${deviceID}`);
//     console.log(`  Distance:       ${distance} cm`);
//     console.log(`  Water Level:    ${waterLevel} cm`);
//     console.log(`  Battery Voltage:${batteryVoltage} V`);
//     console.log(`  Solar Voltage:  ${solarVoltage} V`);
//     console.log(`  Temperature:    ${temp} C`);
//     console.log(`  Humidity:       ${hum} %`);
//     console.log(`  batteryPercent: ${batteryPercent} %`);
//     console.log(`  alert:          ${alert}`);
//     console.log(`  sigDbm:         ${sigDbm} dBm`);
//   } catch (e) {
//     console.error("Error parsing JSON:", e.message);
//   }
// });


//mqtt_subscriber.js-------------------------------------------------
// const mqtt = require("mqtt");

// const BROKER_URL = "mqtt://test.mosquitto.org:1883";
// const TOPIC_1 = "Device1/waterDevice1";
// const TOPIC_2 = "Device2/waterDevice2";

// let latestData = {}; // Store latest data per device
// let broadcastCallback = null; // <- Add this line

// const client = mqtt.connect(BROKER_URL);

// client.on("connect", () => {
//   console.log("Connected successfully to broker.");

//   client.subscribe([TOPIC_1, TOPIC_2], (err) => {
//     if (err) {
//       console.error("Subscription error:", err);
//     } else {
//       console.log(`Subscribed to: ${TOPIC_1}, ${TOPIC_2}`);
//     }
//   });
// });

// client.on("message", (topic, message) => {
//   const payloadStr = message.toString();

//   try {
//     const data = JSON.parse(payloadStr);
//     const deviceID = data.deviceID;

//     latestData[deviceID] = {
//       ...data,
//       topic,
//       receivedAt: new Date().toISOString()
//     };

//     console.log(`Updated data for ${deviceID}`, latestData[deviceID]);

//     // ✅ Broadcast the new data
//     if (broadcastCallback) {
//       broadcastCallback(latestData[deviceID]);
//     }
//   } catch (e) {
//     console.error("Error parsing JSON:", e.message);
//   }
// });

// // Export live data and broadcast callback
// module.exports = {
//   getLatestDeviceData: () => latestData,
//   setBroadcastCallback: (cb) => {
//     broadcastCallback = cb;
//   }
// };

//---------------------------------

// const mqtt = require("mqtt");

// const BROKER_URL = "mqtt://test.mosquitto.org:1883";
// const TOPIC_1 = "Device1/waterDevice1";
// const TOPIC_2 = "Device2/waterDevice2";

// // Dummy data that we want to send
// const dummyData = {
//   deviceID: "FMS00001",
//   distance: 278,
//   waterLevel: -28,
//   batteryVoltage: 4.48,
//   solarVoltage: 23.3,
//   temp: 32.03,
//   hum: 52.36,
//   batteryPercent: 100,
//   alert: "none",
//   sigBm: -57,
//   topic: "Device1/waterDevice1",
//   receivedAt: new Date().toISOString()
// };

// const client = mqtt.connect(BROKER_URL);

// client.on("connect", () => {
//   console.log("Connected successfully to broker.");

//   // Simulate sending data to both topics every minute
//   setInterval(() => {
//     const payload = JSON.stringify(dummyData);
    
//     // Publishing to the topics
//     client.publish(TOPIC_1, payload, (err) => {
//       if (err) {
//         console.error("Failed to send data to TOPIC_1:", err);
//       } else {
//         console.log(`Data sent to ${TOPIC_1}:`, dummyData);
//       }
//     });

//     client.publish(TOPIC_2, payload, (err) => {
//       if (err) {
//         console.error("Failed to send data to TOPIC_2:", err);
//       } else {
//         console.log(`Data sent to ${TOPIC_2}:`, dummyData);
//       }
//     });
//   }, 60000); // Send data every 60 seconds
// });

// client.on("error", (err) => {
//   console.error("Error with MQTT connection:", err);
// });


//---------------------------------------------------------------------------


// const mongoose = require("mongoose");
// const DeviceDataReading = require("../modals/DeviceDataReading");
// const DeviceMaster = require("../modals/DeviceMaster");


// const TOPIC_1 = "Device1/waterDevice1";
// const TOPIC_2 = "Device2/waterDevice2";
// const TOPIC_3 = "Device3/waterDevice3";
// const TOPIC_4 = "Device4/waterDevice4";
// const TOPIC_5 = "Device5/waterDevice5";
// const TOPIC_6 = "Device6/waterDevice6";
// const TOPIC_7 = "Device7/waterDevice7";
// const TOPIC_8 = "Device8/waterDevice8";
// const TOPIC_9 = "Device9/waterDevice9";

// let latestData = {};
// let broadcastCallback = null;

// // Devices list
// const devices = [
//   { deviceID: "FMS00001", topic: TOPIC_1 },
//   { deviceID: "FMS00002", topic: TOPIC_2 },
//   { deviceID: "FMS00003", topic: TOPIC_3 },
//   { deviceID: "FMS00004", topic: TOPIC_4 },
//   { deviceID: "FMS00005", topic: TOPIC_5 },
//   { deviceID: "FMS00006", topic: TOPIC_6 },
//   { deviceID: "FMS00007", topic: TOPIC_7 },
//   { deviceID: "FMS00008", topic: TOPIC_8 },
//   { deviceID: "FMS00009", topic: TOPIC_9 }
// ];

// // Update counter for error simulation
// let updateCounter = {};
// devices.forEach(({ deviceID }) => {
//   updateCounter[deviceID] = 0;
// });

// // Generate dummy data
// function generateRandomData(deviceID, topic) {
//   updateCounter[deviceID] += 1;
//   const isError = updateCounter[deviceID] % 5 === 0;

//   const data = {
//     deviceID,
//     topic,
//     distance: +(Math.random() * 100).toFixed(2),
//     waterLevel: +(Math.random() * 200).toFixed(2),
//     batteryVoltage: +(Math.random() * 12 + 1).toFixed(2),
//     solarVoltage: +(Math.random() * 20 + 5).toFixed(2),
//     temp: isError ? 998 : +(Math.random() * 35 + 10).toFixed(2),
//     hum: isError ? 998 : +(Math.random() * 100).toFixed(2),
//     batteryPercent: Math.floor(Math.random() * 101),
//     alert: ["None", "Yellow", "Orange", "Red"][Math.floor(Math.random() * 4)],
//     sigDbm: -1 * Math.floor(Math.random() * 50 + 70)
//   };

//   return data;
// }

// // Broadcast data every 20 seconds
// setInterval(() => {
//   devices.forEach(async ({ deviceID, topic }) => {
//     const data = generateRandomData(deviceID, topic);
//     latestData[deviceID] = data;

//     const {
//       deviceID: id,
//       distance,
//       waterLevel,
//       batteryVoltage,
//       solarVoltage,
//       temp,
//       hum,
//       batteryPercent,
//       alert,
//       sigDbm
//     } = data;

//     console.log(`\n📡 Fake update for ${id}`);
//     console.log(`  Device ID:      ${id}`);
//     console.log(`  Distance:       ${distance} cm`);
//     console.log(`  Water Level:    ${waterLevel} cm`);
//     console.log(`  Battery Voltage:${batteryVoltage} V`);
//     console.log(`  Solar Voltage:  ${solarVoltage} V`);
//     console.log(`  Temperature:    ${temp} C`);
//     console.log(`  Humidity:       ${hum} %`);
//     console.log(`  batteryPercent: ${batteryPercent} %`);
//     console.log(`  alert:          ${alert}`);
//     console.log(`  sigDbm:         ${sigDbm} dBm`);

//     // ✅ Save to MongoDB
//     try {
//       const reading = new DeviceDataReading({
//         ...data,
//         timestamp: new Date()
//       });
//       await reading.save();
//       console.log(`✅ Saved reading for ${id}`);
//     } catch (err) {
//       console.error(`❌ Failed to save reading for ${id}:`, err.message);
//     }

//     if (broadcastCallback) {
//       broadcastCallback(data);
//     }
//   });
// }, 10000);


// // Export for server integration
// module.exports = {
//   getLatestDeviceData: () => latestData,
//   setBroadcastCallback: (cb) => {
//     broadcastCallback = cb;
//   }
// };


// //This dummy was created at 16apr



//---------------------------------------------------45 alert


const mongoose = require("mongoose");
const DeviceDataReading = require("../modals/DeviceDataReading");
const DeviceDataReadingsAlert = require("../modals/devicedatareadingsalerts");
const DeviceMaster = require("../modals/DeviceMaster");

const TOPICS = Array.from({ length: 9 }, (_, i) => `Device${i + 1}/waterDevice${i + 1}`);
const devices = TOPICS.map((topic, index) => ({
  deviceID: `FMS0000${index + 1}`,
  topic
}));

let latestData = {};
let broadcastCallback = null;
let lastSignalTimes = {};
let deviceStatus = {}; // "online", "disconnected"

// Track override state for FMS00003
let lastOverrideTime = 0;
let overrideOnce = false;


let updateCounter = {};
devices.forEach(({ deviceID }) => {
  updateCounter[deviceID] = 0;
  lastSignalTimes[deviceID] = Date.now();
  deviceStatus[deviceID] = "online";
});

// Generate dummy data
function generateRandomData(deviceID, topic) {
  updateCounter[deviceID] += 1;
  const isError = updateCounter[deviceID] % 5 === 0;

  let forcedWaterLevel = null;

  // Every 5 minutes (1 cycle) override FMS00003's water level > 60
  if (deviceID === "FMS00003") {
    const now = Date.now();
    if (now - lastOverrideTime >= 5 * 60 * 1000) {
      overrideOnce = true;
      lastOverrideTime = now;
    }

    if (overrideOnce) {
      forcedWaterLevel = +(60 + Math.random() * 60).toFixed(2); // e.g., 60–120
      overrideOnce = false;
    }
  }

  return {
    deviceID,
    topic,
    distance: +(Math.random() * 100).toFixed(2),
    waterLevel: forcedWaterLevel !== null ? forcedWaterLevel : +(Math.random() * 200).toFixed(2),
    batteryVoltage: +(Math.random() * 12 + 1).toFixed(2),
    solarVoltage: +(Math.random() * 20 + 5).toFixed(2),
    temp: isError ? 998 : +(Math.random() * 35 + 10).toFixed(2),
    hum: isError ? 998 : +(Math.random() * 100).toFixed(2),
    batteryPercent: Math.floor(Math.random() * 101),
    alert: "none",
    sigDbm: -1 * Math.floor(Math.random() * 50 + 70)
  };
}


// Save alert
const saveAlert = async (deviceID, alertType, waterLevel = null) => {
  try {
    const alertData = {
      deviceID,
      alertType,
      triggeredAt: new Date()
    };

    if (["red", "orange", "yellow"].includes(alertType)) {
      alertData.waterLevel = waterLevel;
    }

    await new DeviceDataReadingsAlert(alertData).save();
    console.log(`🚨 Alert saved: ${deviceID} → ${alertType}${waterLevel !== null ? ` @ ${waterLevel} cm` : ""}`);
  } catch (err) {
    console.error(`❌ Failed to save alert for ${deviceID}:`, err.message);
  }
};
 

// Broadcast data every 10 seconds
setInterval(async () => {
  for (const { deviceID, topic } of devices) {
    const data = generateRandomData(deviceID, topic);
    const now = Date.now();
    latestData[deviceID] = data;
    lastSignalTimes[deviceID] = now;

    const {
      distance,
      waterLevel,
      batteryVoltage,
      solarVoltage,
      temp,
      hum,
      batteryPercent,
      sigDbm
    } = data;

    // Log
    console.log(`\n📡 Fake update for ${deviceID}`);
    console.log(`  Distance: ${distance} cm, Water Level: ${waterLevel} cm`);
    console.log(`  Battery: ${batteryVoltage} V, Solar: ${solarVoltage} V`);
    console.log(`  Temp: ${temp} C, Humidity: ${hum} %, Signal: ${sigDbm} dBm`);

    // Save to readings
    try {
      await new DeviceDataReading({
        ...data,
        timestamp: new Date()
      }).save();
      console.log(`✅ Saved reading for ${deviceID}`);
    } catch (err) {
      console.error(`❌ Save error for ${deviceID}:`, err.message);
    }

    // Fetch alert thresholds
    const thresholds = await DeviceMaster.findOne({ deviceID });
    if (thresholds) {
      const { red, orange, yellow } = thresholds;

      if (waterLevel >= red) {
        await saveAlert(deviceID, "red", waterLevel);
      } else if (waterLevel >= orange) {
        await saveAlert(deviceID, "orange", waterLevel);
      } else if (waterLevel >= yellow) {
        await saveAlert(deviceID, "yellow", waterLevel);
      }
    }

    // Save error alert for temp/hum = 998
    if (temp === 998 || hum === 998) {
      await saveAlert(deviceID, "error");
    }

    if (broadcastCallback) {
      broadcastCallback(data);
    }
  }
}, 10000);

// Check disconnected devices every minute
setInterval(async () => {
  const now = Date.now();
  for (const device of devices) {
    const { deviceID } = device;
    const lastTime = lastSignalTimes[deviceID];
    const diff = now - lastTime;

    if (diff > 10 * 60 * 1000 && deviceStatus[deviceID] !== "disconnected") {
      await saveAlert(deviceID, "device disconnected");
      deviceStatus[deviceID] = "disconnected";
    }

    if (deviceStatus[deviceID] === "disconnected" && diff <= 10 * 60 * 1000) {
      await saveAlert(deviceID, "back online");
      deviceStatus[deviceID] = "online";
    }
  }
}, 60 * 1000);

// Export for integration
module.exports = {
  getLatestDeviceData: () => latestData,
  setBroadcastCallback: (cb) => {
    broadcastCallback = cb;
  }
};


//---------------

// const mongoose = require("mongoose");
// const DeviceDataReading = require("../modals/DeviceDataReading");
// const DeviceDataReadingsAlert = require("../modals/devicedatareadingsalerts");
// const DeviceMaster = require("../modals/DeviceMaster");

// const TOPICS = Array.from({ length: 9 }, (_, i) => `Device${i + 1}/waterDevice${i + 1}`);
// const devices = TOPICS.map((topic, index) => ({
//   deviceID: `FMS0000${index + 1}`,
//   topic
// }));

// let latestData = {};
// let broadcastCallback = null;
// let lastSignalTimes = {};
// let deviceStatus = {}; // "online", "disconnected"

// // Track override state
// let lastOverrideTime03 = 0;
// let overrideOnce03 = false;

// let lastOverrideTime04 = 0;
// let overrideOnce04 = false;

// let lastOverrideTime05 = 0;
// let overrideOnce05 = false;

// let updateCounter = {};
// devices.forEach(({ deviceID }) => {
//   updateCounter[deviceID] = 0;
//   lastSignalTimes[deviceID] = Date.now();
//   deviceStatus[deviceID] = "online";
// });

// // Generate dummy data
// function generateRandomData(deviceID, topic) {
//   updateCounter[deviceID] += 1;
//   const isError = updateCounter[deviceID] % 5 === 0;

//   let forcedWaterLevel = null;
//   const now = Date.now();

//   if (deviceID === "FMS00003") {
//     if (now - lastOverrideTime03 >= 5 * 60 * 1000) {
//       overrideOnce03 = true;
//       lastOverrideTime03 = now;
//     }
//     if (overrideOnce03) {
//       forcedWaterLevel = +(60 + Math.random() * 60).toFixed(2); // > 60
//       overrideOnce03 = false;
//     }
//   }

//   if (deviceID === "FMS00004") {
//     if (now - lastOverrideTime03 >= 30000 && now - lastOverrideTime04 >= 5 * 60 * 1000) {
//       overrideOnce04 = true;
//       lastOverrideTime04 = now;
//     }
//     if (overrideOnce04) {
//       forcedWaterLevel = +(40 + Math.random() * 10).toFixed(2); // 40-50
//       overrideOnce04 = false;
//     }
//   }

//   if (deviceID === "FMS00005") {
//     if (now - lastOverrideTime04 >= 30000 && now - lastOverrideTime05 >= 5 * 60 * 1000) {
//       overrideOnce05 = true;
//       lastOverrideTime05 = now;
//     }
//     if (overrideOnce05) {
//       forcedWaterLevel = +(30 + Math.random() * 10).toFixed(2); // 30-40
//       overrideOnce05 = false;
//     }
//   }

//   return {
//     deviceID,
//     topic,
//     distance: +(Math.random() * 100).toFixed(2),
//     waterLevel: forcedWaterLevel !== null ? forcedWaterLevel : +(Math.random() * 200).toFixed(2),
//     batteryVoltage: +(Math.random() * 12 + 1).toFixed(2),
//     solarVoltage: +(Math.random() * 20 + 5).toFixed(2),
//     temp: isError ? 998 : +(Math.random() * 35 + 10).toFixed(2),
//     hum: isError ? 998 : +(Math.random() * 100).toFixed(2),
//     batteryPercent: Math.floor(Math.random() * 101),
//     alert: "none",
//     sigDbm: -1 * Math.floor(Math.random() * 50 + 70)
//   };
// }

// // Save alert
// const saveAlert = async (deviceID, alertType, waterLevel = null) => {
//   try {
//     const alertData = {
//       deviceID,
//       alertType,
//       triggeredAt: new Date()
//     };

//     if (["red", "orange", "yellow"].includes(alertType)) {
//       alertData.waterLevel = waterLevel;
//     }

//     await new DeviceDataReadingsAlert(alertData).save();
//     console.log(`🚨 Alert saved: ${deviceID} → ${alertType}${waterLevel !== null ? ` @ ${waterLevel} cm` : ""}`);
//   } catch (err) {
//     console.error(`❌ Failed to save alert for ${deviceID}:`, err.message);
//   }
// };

// // Broadcast data every 10 seconds
// setInterval(async () => {
//   for (const { deviceID, topic } of devices) {
//     const data = generateRandomData(deviceID, topic);
//     const now = Date.now();
//     latestData[deviceID] = data;
//     lastSignalTimes[deviceID] = now;

//     const {
//       distance,
//       waterLevel,
//       batteryVoltage,
//       solarVoltage,
//       temp,
//       hum,
//       batteryPercent,
//       sigDbm
//     } = data;

//     console.log(`\n📱 Fake update for ${deviceID}`);
//     console.log(`  Distance: ${distance} cm, Water Level: ${waterLevel} cm`);
//     console.log(`  Battery: ${batteryVoltage} V, Solar: ${solarVoltage} V`);
//     console.log(`  Temp: ${temp} C, Humidity: ${hum} %, Signal: ${sigDbm} dBm`);

//     try {
//       await new DeviceDataReading({ ...data, timestamp: new Date() }).save();
//       console.log(`✅ Saved reading for ${deviceID}`);
//     } catch (err) {
//       console.error(`❌ Save error for ${deviceID}:`, err.message);
//     }

//     const thresholds = await DeviceMaster.findOne({ deviceID });
//     if (thresholds) {
//       const { red, orange, yellow } = thresholds;
//       if (waterLevel >= red) {
//         await saveAlert(deviceID, "red", waterLevel);
//       } else if (waterLevel >= orange) {
//         await saveAlert(deviceID, "orange", waterLevel);
//       } else if (waterLevel >= yellow) {
//         await saveAlert(deviceID, "yellow", waterLevel);
//       }
//     }

//     if (temp === 998 || hum === 998) {
//       await saveAlert(deviceID, "error");
//     }

//     if (broadcastCallback) {
//       broadcastCallback(data);
//     }
//   }
// }, 10000);

// // Check disconnected devices every minute
// setInterval(async () => {
//   const now = Date.now();
//   for (const device of devices) {
//     const { deviceID } = device;
//     const lastTime = lastSignalTimes[deviceID];
//     const diff = now - lastTime;

//     if (diff > 10 * 60 * 1000 && deviceStatus[deviceID] !== "disconnected") {
//       await saveAlert(deviceID, "device disconnected");
//       deviceStatus[deviceID] = "disconnected";
//     }

//     if (deviceStatus[deviceID] === "disconnected" && diff <= 10 * 60 * 1000) {
//       await saveAlert(deviceID, "back online");
//       deviceStatus[deviceID] = "online";
//     }
//   }
// }, 60000);

// module.exports = {
//   getLatestDeviceData: () => latestData,
//   setBroadcastCallback: (cb) => {
//     broadcastCallback = cb;
//   }
// };