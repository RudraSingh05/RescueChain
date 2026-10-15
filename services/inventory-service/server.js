
require("dotenv").config();

const app = require("./index");
const {
  startReservationExpiryWorker,
} = require("./src/workers/reservationExpiry");

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Inventory Service running on port ${PORT}`);

  // Start pickup reservation expiry worker
  startReservationExpiryWorker();
});
