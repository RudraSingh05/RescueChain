const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { calculateDistance } = require("../utils/distance");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/deduct", async (req, res) => {
  const { itemName, quantity } = req.body;

  try {
    await prisma.$transaction(async (tx) => {

      const item = await tx.inventory.findFirst({
        where: { itemName },
        orderBy: { quantity: "desc" }
      });

      if (!item || item.quantity < quantity) {
        throw new Error("Insufficient stock");
      }

      await tx.inventory.update({
        where: { id: item.id },
        data: {
          quantity: item.quantity - quantity
        }
      });

    });

    res.json({ message: "Stock deducted safely" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /inventory/suppliers/nearest
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

// POST /inventory/reserve
router.post("/reserve", async (req, res) => {
  try {
    const { supplierId, itemName, quantity, requestType } = req.body;

    if (!supplierId || !itemName || !quantity || !requestType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.findFirst({
        where: { supplierId, itemName },
      });

      if (!inventory || inventory.quantity < quantity) {
        throw new Error("Insufficient stock");
      }

      await tx.inventory.update({
        where: { id: inventory.id },
        data: { quantity: inventory.quantity - quantity },
      });

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      const reservation = await tx.reservation.create({
        data: {
          supplierId,
          itemName,
          quantity,
          type: requestType,
          status: "RESERVED",
          expiresAt,
        },
      });

      return reservation;
    });

    res.json({
      message: "Reservation successful",
      reservation: result,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/test-db", async (req, res) => {
  try {
    const items = await prisma.inventory.findMany();
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
