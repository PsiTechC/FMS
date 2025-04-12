



// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors({
//   origin: process.env.REACT_FE,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());

// // MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB connected"))
// .catch(err => console.error("❌ MongoDB connection error:", err));

// // Routes
// app.use("/api", require("./routes/ForAdmin"));
// app.use("/api", require("./routes/clientRoutes"));
// app.use("/api", require("./routes/deviceRoutes"));
// app.use("/api", require("./routes/deviceMappingRoutes"));
// app.use("/api", require("./routes/passwordResetRoutes"));
// app.use("/api", require("./routes/deviceDataRoutes"));
// app.use("/api/auth", require("./routes/auth"));

// // ✅ ONLY this one route from MQTT (for HTTP use)
// app.use("/api", require("./routes/mqttRoutes")); // getLatestDeviceData()

// // Start HTTP server only (no WebSocket here)
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🌐 HTTP API Server running at http://localhost:${PORT}`);
// });


const http = require("http");
const { Server } = require("ws");
const { setBroadcastCallback } = require("./routes/mqtt_subscriber"); // ✅ Core file

const WS_PORT = 5001;

const server = http.createServer();
const wss = new Server({ server, path: "/ws/live" });

// Set callback to push MQTT updates to connected clients
setBroadcastCallback((mqttData) => {
  const json = JSON.stringify(mqttData);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(json);
    }
  });
});

wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");
  ws.on("close", () => console.log("❌ WebSocket client disconnected"));
});

server.listen(WS_PORT, () => {
  console.log(`📡 WebSocket Server running on ws://localhost:${WS_PORT}/ws/live`);
});

