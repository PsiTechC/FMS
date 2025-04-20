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

app.use(express.json());


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

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "https://fms.eulerianbots.com",
  "http://localhost:3000"  // ← include this for development
];


app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));


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
const getAlertLive = require("./routes/getDataLive"); // adjust path as needed
app.use("/api", getAlertLive);
app.use("/api/device-data", deviceDataRoutes); // 👈 makes it available at /api/device-data


const getDataRoute = require("./routes/getAlertLive"); // update path as needed
app.use("/api", getDataRoute);

const passwordResetRoutes = require("./routes/passwordResetRoutes");
app.use("/api", passwordResetRoutes);
const deviceMappingRoutes = require('./routes/deviceMappingRoutes');
app.use("/api", deviceMappingRoutes);

const alertRoutes = require("./routes/alertRoutes");
app.use("/api", alertRoutes);


app.use("/api", require("./routes/deviceDataRoutes"));
const mqttRoutes = require("./routes/mqttRoutes");
app.use("/api/auth", require("./routes/auth"));

app.use("/api", mqttRoutes);

// 🚀 Start server (same port for HTTP + WebSocket)
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



