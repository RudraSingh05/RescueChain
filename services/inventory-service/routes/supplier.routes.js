const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("../middleware/inventory.middleware");

const router = express.Router();
const prisma = new PrismaClient();


router.post("/add", authenticate, async (req, res) => {
  try {

    const { itemName, quantity } = req.body;

    const supplier = await prisma.supplier.findFirst({
      where: { userId: req.user.userId }
    });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const inventory = await prisma.inventory.create({
      data: {
        itemName,
        quantity: parseInt(quantity),
        supplierId: supplier.id
      }
    });

    res.json(inventory);

  } catch (error) {

    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Item already exists. Use update stock."
      });
    }

    res.status(500).json({ error: "Inventory creation failed" });
  }
});


router.patch("/update", authenticate, async (req, res) => {

  const { itemName, quantity } = req.body;

  const supplier = await prisma.supplier.findFirst({
    where: { userId: req.user.userId }
  });

  if (!supplier) {
    return res.status(404).json({ error: "Supplier not found" });
  }

  const updated = await prisma.inventory.update({
    where: {
      supplierId_itemName: {
        supplierId: supplier.id,
        itemName
      }
    },
    data: {
      quantity: parseInt(quantity)
    }
  });

  res.json(updated);

});


router.get("/my", authenticate, async (req, res) => {

  const supplier = await prisma.supplier.findFirst({
    where: {
      userId: req.user.userId
    }
  });

  if (!supplier) {
    return res.status(404).json({ error: "Supplier not found" });
  }

  const inventory = await prisma.inventory.findMany({
    where: {
      supplierId: supplier.id
    }
  });

  res.json(inventory);

});


router.get("/reservations", authenticate, async (req, res) => {

  const supplier = await prisma.supplier.findFirst({
    where: { userId: req.user.userId }
  });

  if (!supplier) {
    return res.status(404).json({ error: "Supplier not found" });
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      supplierId: supplier.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(reservations);

});

module.exports = router;