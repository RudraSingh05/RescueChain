const express = require("express");
const { PrismaClient } = require("@prisma/client");

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

module.exports = router;
