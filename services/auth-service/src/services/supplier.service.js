const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function applySupplier(req, res) {

  try {

    const userId = req.user.userId;

    const { organizationName, type, latitude, longitude } = req.body;

    // Check if user already applied
    const existingApplication = await prisma.supplierApplication.findFirst({
      where: { userId }
    });

    if (existingApplication) {
      return res.status(400).json({
        error: "You have already applied to become a supplier"
      });
    }

    const application = await prisma.supplierApplication.create({
      data: {
        userId,
        organizationName,
        type,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    });

    res.json({
      message: "Supplier application submitted",
      application
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Supplier application failed"
    });

  }

}

module.exports = { applySupplier };