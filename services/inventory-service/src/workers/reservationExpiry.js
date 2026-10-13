const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function startReservationExpiryWorker() {
  setInterval(async () => {
    try {
      console.log("Checking expired reservations...");

      const now = new Date();

      const expiredReservations = await prisma.reservation.findMany({
        where: {
          status: "RESERVED",
          expiresAt: { lte: now },
        },
      });

      for (const reservation of expiredReservations) {
        await prisma.$transaction(async (tx) => {
          const inventory = await tx.inventory.findFirst({
            where: {
              supplierId: reservation.supplierId,
              itemName: reservation.itemName,
            },
          });

          if (inventory) {
            await tx.inventory.update({
              where: { id: inventory.id },
              data: {
                quantity: inventory.quantity + reservation.quantity,
              },
            });
          }

          await tx.reservation.update({
            where: { id: reservation.id },
            data: { status: "CANCELLED" },
          });
        });

        console.log(`Reservation ${reservation.id} expired`);
      }
    } catch (err) {
      console.error("Expiry worker error:", err);
    }
  }, 60000);
}

module.exports = { startReservationExpiryWorker };
