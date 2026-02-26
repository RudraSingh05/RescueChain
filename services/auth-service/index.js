const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/auth.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

module.exports = app;