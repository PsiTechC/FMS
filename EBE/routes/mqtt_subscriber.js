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
const mqtt = require("mqtt");

const BROKER_URL = "mqtt://test.mosquitto.org:1883";
const TOPIC_1 = "Device1/waterDevice1";
const TOPIC_2 = "Device2/waterDevice2";

let latestData = {}; // Store latest data per device
let broadcastCallback = null; // <- Add this line

const client = mqtt.connect(BROKER_URL);

client.on("connect", () => {
  console.log("Connected successfully to broker.");

  client.subscribe([TOPIC_1, TOPIC_2], (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log(`Subscribed to: ${TOPIC_1}, ${TOPIC_2}`);
    }
  });
});

client.on("message", (topic, message) => {
  const payloadStr = message.toString();

  try {
    const data = JSON.parse(payloadStr);
    const deviceID = data.deviceID;

    latestData[deviceID] = {
      ...data,
      topic,
      receivedAt: new Date().toISOString()
    };

    console.log(`Updated data for ${deviceID}`, latestData[deviceID]);

    // ✅ Broadcast the new data
    if (broadcastCallback) {
      broadcastCallback(latestData[deviceID]);
    }
  } catch (e) {
    console.error("Error parsing JSON:", e.message);
  }
});

// Export live data and broadcast callback
module.exports = {
  getLatestDeviceData: () => latestData,
  setBroadcastCallback: (cb) => {
    broadcastCallback = cb;
  }
};

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


//----------------------------------------------------------------------------

// const TOPIC_1 = "Device1/waterDevice1";
// const TOPIC_2 = "Device2/waterDevice2";
// const TOPIC_3 = "Device3/waterDevice3";
// const TOPIC_4 = "Device4/waterDevice4";
// const TOPIC_5 = "Device5/waterDevice5";
// const TOPIC_6 = "Device6/waterDevice6";

// let latestData = {};
// let broadcastCallback = null;

// // Extended list of specific device IDs
// const devices = [
//   { deviceID: "FMS00001", topic: TOPIC_1 },
//   { deviceID: "FMS00002", topic: TOPIC_2 },
//   { deviceID: "FMS00003", topic: TOPIC_3 },
//   { deviceID: "FMS00004", topic: TOPIC_4 },
//   { deviceID: "FMS00005", topic: TOPIC_5 },
//   { deviceID: "FMS00006", topic: TOPIC_6 }
// ];

// // Generate random data for a given device
// function generateRandomData(deviceID, topic) {
//   return {
//     deviceID,
//     topic,
//     distance: +(Math.random() * 100).toFixed(2),          // cm
//     waterLevel: +(Math.random() * 200).toFixed(2),        // cm
//     batteryVoltage: +(Math.random() * 12 + 1).toFixed(2), // volts
//     solarVoltage: +(Math.random() * 20 + 5).toFixed(2),   // volts
//     temp: +(Math.random() * 35 + 10).toFixed(2),          // °C
//     hum: +(Math.random() * 100).toFixed(2),               // %
//     receivedAt: new Date().toISOString()
//   };
// }

// // Simulate incoming data every 10 seconds
// setInterval(() => {
//   devices.forEach(({ deviceID, topic }) => {
//     const data = generateRandomData(deviceID, topic);

//     latestData[deviceID] = data;
//     console.log(`📡 Fake update for ${deviceID}`, data);

//     if (broadcastCallback) {
//       broadcastCallback(data);
//     }
//   });
// }, 10000);

// // Export API
// module.exports = {
//   getLatestDeviceData: () => latestData,
//   setBroadcastCallback: (cb) => {
//     broadcastCallback = cb;
//   }
// };




