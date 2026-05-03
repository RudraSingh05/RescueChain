const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { calculateDistance } = require("../utils/distance");
const deliveryQueue = require("../queues/deliveryQueue");
const { authenticate } = require("../middleware/inventory.middleware");

const router = express.Router();
const prisma = new PrismaClient();


router.get("/suppliers/nearest", async (req, res) => {
  try {
    const { itemName, quantity, latitude, longitude } = req.query;

    if (!itemName || !quantity || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing required query params" });
    }

    const suppliers = await prisma.supplier.findMany({
      include: { inventory: true },
    });

    const availableSuppliers = [];

    suppliers.forEach((supplier) => {
      const item = supplier.inventory.find(
        (inv) =>
          inv.itemName === itemName &&
          inv.quantity >= parseInt(quantity)
      );

      if (item) {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          supplier.latitude,
          supplier.longitude
        );

        availableSuppliers.push({
          id: supplier.id,
          name: supplier.name,
          type: supplier.type,
          distance,
          availableQuantity: item.quantity,
          latitude: supplier.latitude,
          longitude: supplier.longitude
        });
      }
    });

    availableSuppliers.sort((a, b) => a.distance - b.distance);

    res.json(availableSuppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reserve", authenticate, async (req, res) => {
  try {

    const { supplierId, itemName, quantity, requestType } = req.body;
    const userId = req.user.userId;

    if (!supplierId || !itemName || !quantity || !requestType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const reservation = await prisma.$transaction(async (tx) => {

      const updated = await tx.inventory.updateMany({
        where: {
          supplierId,
          itemName,
          quantity: { gte: quantity },
        },
        data: {
          quantity: { decrement: quantity },
        },
      });

      if (updated.count === 0) {
        throw new Error("Insufficient stock or concurrent reservation");
      }

      let expiryDuration;

      if (requestType === "PICKUP") {
        expiryDuration = 15 * 60 * 1000;
      } else if (requestType === "DELIVERY") {
        expiryDuration = 1 * 60 * 1000;
      }

      const expiresAt = new Date(Date.now() + expiryDuration);

      const reservation = await tx.reservation.create({
        data: {
          supplierId,
          userId,
          itemName,
          quantity,
          type: requestType,
          status: "RESERVED",
          expiresAt,
        },
      });

      return reservation;
    });

    if (requestType === "DELIVERY") {
      await deliveryQueue.add(
        "autoConfirmDelivery",
        { reservationId: reservation.id },
        {
          delay: 60 * 1000,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        }
      );
    }

    res.json({
      message: "Reservation successful",
      reservation,
    });

  } catch (error) {
    res.status(409).json({ error: error.message });
  }
});

router.post("/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new Error("Reservation not found");
      }

      if (reservation.status !== "RESERVED") {
        throw new Error("Only RESERVED orders can be cancelled");
      }

      // 🔵 DELIVERY → 1 minute cancellation window
      if (reservation.type === "DELIVERY") {
        const now = Date.now();
        const createdTime = new Date(reservation.createdAt).getTime();

        const oneMinutePassed = now - createdTime > 60 * 1000;

        if (oneMinutePassed) {
          throw new Error("Cancellation window expired for delivery");
        }
      }

      // 🟢 PICKUP → no manual time restriction (worker handles expiry)

      // Restore inventory
      const inventory = await tx.inventory.findFirst({
        where: {
          supplierId: reservation.supplierId,
          itemName: reservation.itemName,
        },
      });

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: inventory.quantity + reservation.quantity,
        },
      });

      // Update reservation status
      await tx.reservation.update({
        where: { id },
        data: {
          status: "CANCELLED",
        },
      });

      return { message: "Reservation cancelled successfully" };
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/my", authenticate, async (req, res) => {
  console.log("Logged in user:", req.user);
  try {

    const reservations = await prisma.reservation.findMany({
      where: {
        userId: req.user.userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(reservations);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});


module.exports = router;