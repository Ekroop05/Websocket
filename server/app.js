const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/apiRoutes"); // ✅ IMPORT

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ADD THIS LINE (MOST IMPORTANT)
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("WebSocket Server Running 🚀");
});

module.exports = app;