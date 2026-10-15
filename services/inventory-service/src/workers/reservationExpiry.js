
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

let intervalId;

async function expireReservations() {
  const now = new Date();

  try {
    const expiredReservations = await prisma.reservation.findMany({
      where: {
        status: "RESERVED",
        expiresAt: { lte: now },
        type: "PICKUP",
      },
      select: {
        id: true,
        supplierId: true,
        itemName: true,
        quantity: true,
      },
    });

    for (const reservation of expiredReservations) {
      try {
        const expired = await prisma.$transaction(async (tx) => {
          const claimed = await tx.reservation.updateMany({
            where: {
              id: reservation.id,
              status: "RESERVED",
              type: "PICKUP",
              expiresAt: { lte: new Date() },
            },
            data: {
              status: "CANCELLED",
            },
          });

          if (claimed.count === 0) {
            return false;
          }

          await tx.inventory.updateMany({
            where: {
              supplierId: reservation.supplierId,
              itemName: reservation.itemName,
            },
            data: {
              quantity: {
                increment: reservation.quantity,
              },
            },
          });

          return true;
        });

        if (expired) {
          console.log(`Reservation ${reservation.id} expired`);
        }
      } catch (error) {
        console.error(
          `Failed to expire reservation ${reservation.id}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Expiry worker error:", error);
  }
}

function startReservationExpiryWorker() {
  if (intervalId) return;

  console.log("Reservation expiry worker started");

  expireReservations().catch(console.error);

  intervalId = setInterval(() => {
    expireReservations().catch(console.error);
  }, 60000);
}

module.exports = { startReservationExpiryWorker };
