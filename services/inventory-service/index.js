const express = require("express");
const cors = require("cors");

const inventoryRoutes = require("./routes/inventory");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/inventory", inventoryRoutes);

module.exports = app;