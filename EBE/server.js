const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // at the top of your server.js


const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect("mongodb+srv://psitech:Psitech123@pms.ijqbdmu.mongodb.net/FMS", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// ✅ Import & use routes
const adminRoutes = require("./routes/ForAdmin");
app.use("/api", adminRoutes);

const clientRoutes = require("./routes/clientRoutes");
app.use("/api", clientRoutes); // → means /api/clients will work

const deviceRoutes = require("./routes/deviceRoutes");
app.use("/api", deviceRoutes);

const deviceMappingRoutes = require("./routes/deviceMappingRoutes");
app.use("/api", deviceMappingRoutes); // ✅ makes /api/mappings available

const deviceDataRoutes = require("./routes/deviceDataRoutes");
app.use("/api", deviceDataRoutes);


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
