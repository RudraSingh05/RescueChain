const { Worker } = require("bullmq");
const Redis = require("ioredis");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "deliveryQueue",
  async job => {
    const { reservationId } = job.data;

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation || reservation.status !== "RESERVED") {
      return;
    }

    await prisma.$transaction(async tx => {
      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: "COMPLETED" },
      });

      await tx.delivery.upsert({
        where: { reservationId },
        update: {},
        create: {
          reservationId,
          supplierId: reservation.supplierId,
          status: "OUT_FOR_DELIVERY",
          startedAt: new Date(),
        },
      });
    });

    console.log("Auto confirmed:", reservationId);
  },
  { connection }
);

worker.on("completed", job => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed`, err);
});