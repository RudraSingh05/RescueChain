require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const { authenticate } = require("./src/middleware/auth.middleware");


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

app.get("/health", (req, res) => {
  res.json({ status: "Auth Service Running ✅" });
});

module.exports = app;
