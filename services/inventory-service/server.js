const app = require("./index");
const { startReservationExpiryWorker } = require("./workers/reservationExpiry");

const PORT = 4000;

startReservationExpiryWorker();

app.listen(PORT, () => {
  console.log(`Inventory service running on port ${PORT}`);
});