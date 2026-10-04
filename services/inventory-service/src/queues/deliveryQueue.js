const { Queue } = require("bullmq");
const Redis = require("ioredis");

let connection = null;
let deliveryQueue = null;

function getDeliveryQueue() {
  if (!connection) {
    connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: null,
    });
  }

  if (!deliveryQueue) {
    deliveryQueue = new Queue("deliveryQueue", {
      connection,
    });
  }

  return deliveryQueue;
}

module.exports = { getDeliveryQueue };
