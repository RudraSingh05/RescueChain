const app = require("./index");
const { startReservationExpiryWorker } = require("./src/workers/reservationExpiry");

const PORT = 4000;

// Start pickup expiry worker
startReservationExpiryWorker();

app.listen(PORT, () => {
  console.log(`Inventory service running on port ${PORT}`);
});
