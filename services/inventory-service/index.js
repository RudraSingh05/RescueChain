const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const supplierRoutes = require("./routes/supplier.routes");
const adminRoutes = require("./routes/admin.routes");

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

module.exports = app;