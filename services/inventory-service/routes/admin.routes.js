const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("../middleware/inventory.middleware");

const router = express.Router();
const prisma = new PrismaClient();


// CREATE SUPPLIER
router.post("/supplier/create", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Only admin can create suppliers"
      });
    }

    const { userId, name, latitude, longitude, type } = req.body;

    const supplier = await prisma.supplier.create({
      data: {
        userId,
        name,
        latitude,
        longitude,
        type
      }
    });

    res.json({
      message: "Supplier created successfully",
      supplier
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


router.get("/all", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const data = await prisma.inventory.findMany({
      include: {
        supplier: true
      }
    });

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});


router.get("/low-stock", authenticate, async (req, res) => {
  try {
    const threshold = 10;

    const lowStock = await prisma.inventory.findMany({
      where: {
        quantity: {
          lte: threshold
        }
      },
      include: {
        supplier: true
      }
    });

    res.json(lowStock);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch low stock" });
  }
});

module.exports = router;