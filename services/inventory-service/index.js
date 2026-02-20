const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { calculateDistance } = require("./utils/distance");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/suppliers/nearest", async (req, res) => {
  try {
    const { itemName, quantity, latitude, longitude } = req.query;

    if (!itemName || !quantity || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing required query params" });
    }

    const suppliers = await prisma.supplier.findMany({
      include: {
        inventory: true,
      },
    });

    const availableSuppliers = [];

    suppliers.forEach((supplier) => {
      const item = supplier.inventory.find(
        (inv) =>
          inv.itemName === itemName && inv.quantity >= parseInt(quantity)
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
          distance: distance,
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

app.post("/reserve", async (req, res) => {
  try {
    const { supplierId, itemName, quantity, requestType } = req.body;

    if (!supplierId || !itemName || !quantity || !requestType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.findFirst({
        where: {
          supplierId,
          itemName,
        },
      });

      if (!inventory || inventory.quantity < quantity) {
        throw new Error("Insufficient stock");
      }

      // Deduct stock
      await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: inventory.quantity - quantity,
        },
      });

      // Create reservation
      const reservation = await tx.reservation.create({
        data: {
          supplierId,
          itemName,
          quantity,
          type: requestType,
          status: "RESERVED",
        },
      });

      return reservation;
    });

    res.json({
      message: "Reservation successful",
      reservation: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

app.listen(4000, () => {
  console.log("Inventory service running on port 4000");
});