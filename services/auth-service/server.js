const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));

app.listen(5000, () => {
  console.log(`Auth service running on port 4000`);
});
