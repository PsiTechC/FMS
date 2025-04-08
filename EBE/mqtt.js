// mqtt_subscriber.js

const mqtt = require('mqtt');

// Public broker details (example: test.mosquitto.org)
const BROKER_URL = 'mqtt://test.mosquitto.org';
const BROKER_PORT = 1883;
const TOPIC = 'myTopic/waterData';

// Create client (no username/password for test.mosquitto.org)
const client = mqtt.connect(`${BROKER_URL}:${BROKER_PORT}`, {
  clientId: 'JavaScriptSub'
});

// Store recent water level readings
const waterLevelData = [];

if (typeof waterLevel === "number") {
  const timestamp = new Date();
  waterLevelData.push({ timestamp, waterLevel });

  // Limit array size to 20 for performance
  if (waterLevelData.length > 20) {
    waterLevelData.shift();
  }

  console.log(`📊 Stored waterLevel: ${waterLevel} cm at ${timestamp.toLocaleTimeString()}`);
}


// Handle successful connection
client.on('connect', () => {
  console.log('Connected successfully to broker.');
  // Subscribe to the specified topic
  client.subscribe(TOPIC, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${TOPIC}`);
    } else {
      console.error('Subscription error:', err);
    }
  });
});

// Handle incoming messages
client.on('message', (topic, messageBuffer) => {
  const payloadStr = messageBuffer.toString();
  console.log(`\nTopic: ${topic}\nRaw Message: ${payloadStr}`);

  try {
    // Parse the JSON payload
    const data = JSON.parse(payloadStr);

    // Extract fields (adjust these to match your ESP32 payload)
    const deviceID        = data.deviceID;
    const distance        = data.distance;
    const waterLevel      = data.waterLevel;
    const batteryVoltage  = data.batteryVoltage;
    const solarVoltage    = data.solarVoltage;
    const temperature     = data.temp;
    const humidity        = data.hum;

    console.log('Parsed data:');
    console.log(`  deviceID:       ${deviceID}`);
    console.log(`  distance:       ${distance}`);
    console.log(`  waterLevel:     ${waterLevel}`);
    console.log(`  batteryVoltage: ${batteryVoltage}`);
    console.log(`  solarVoltage:   ${solarVoltage}`);
    console.log(`  temperature:    ${temperature}`);
    console.log(`  humidity:       ${humidity}`);
  } catch (e) {
    console.error('Error parsing JSON:', e);
  }
});

// Handle errors
client.on('error', (error) => {
  console.error('MQTT Error:', error);
});


module.exports = waterLevelData;
