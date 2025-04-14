// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config(); // at the top of your server.js

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ MongoDB connection
// mongoose.connect("mongodb+srv://psitech:Psitech123@pms.ijqbdmu.mongodb.net/FMS", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("MongoDB connected"))
// .catch(err => console.error("MongoDB connection error:", err));

// // ✅ Import & use routes
// const adminRoutes = require("./routes/ForAdmin");
// app.use("/api", adminRoutes);

// const clientRoutes = require("./routes/clientRoutes");
// app.use("/api", clientRoutes); // → means /api/clients will work

// const deviceRoutes = require("./routes/deviceRoutes");
// app.use("/api", deviceRoutes);

// const deviceMappingRoutes = require("./routes/deviceMappingRoutes");
// app.use("/api", deviceMappingRoutes); // ✅ makes /api/mappings available

// const deviceDataRoutes = require("./routes/deviceDataRoutes");
// app.use("/api", deviceDataRoutes);


// app.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });

//---------------------------------------------------------------------------------------------------

const express = require("express");
const http = require("http"); // ✅ Wrap Express
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server from Express

// 🧠 WebSocket Setup
const { Server } = require("ws");
const { setBroadcastCallback } = require("./routes/mqtt_subscriber"); // Make sure you export setBroadcastCallback

const wss = new Server({ server, path: "/ws/live" });

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

// 🔐 Middleware
app.use(cors({
  origin: process.env.REACT_FE,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 🔌 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// 🛠 Routes
app.use("/api", require("./routes/ForAdmin"));
app.use("/api", require("./routes/clientRoutes"));
app.use("/api", require("./routes/deviceRoutes"));
app.use("/api", require("./routes/deviceMappingRoutes"));
const deviceDataRoutes = require("./routes/deviceDataRoutes");
const fakeDevice = require('./fakeDeviceSimulator');

app.use("/api/device-data", deviceDataRoutes); // 👈 makes it available at /api/device-data

const passwordResetRoutes = require("./routes/passwordResetRoutes");
app.use("/api", passwordResetRoutes);
const deviceMappingRoutes = require('./routes/deviceMappingRoutes');
app.use("/api", deviceMappingRoutes);

app.use("/api", require("./routes/deviceDataRoutes"));
const mqttRoutes = require("./routes/mqttRoutes");
app.use("/api/auth", require("./routes/auth"));

app.use("/api", mqttRoutes);

// 🚀 Start server (same port for HTTP + WebSocket)
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});







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

