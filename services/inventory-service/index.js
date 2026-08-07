const express = require("express");
const cors = require("cors");

const { version } = require("./package.json");

const userRoutes = require("./src/routes/user.routes");
const supplierRoutes = require("./src/routes/supplier.routes");
const adminRoutes = require("./src/routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQUEST RECEIVED:", req.method, req.url);
  next();
});

app.use("/inventory/user", userRoutes);
app.use("/inventory/supplier", supplierRoutes);
app.use("/inventory/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "inventory-service",
    version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
