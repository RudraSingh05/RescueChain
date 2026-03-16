const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getApplications(req, res) {

  const apps = await prisma.supplierApplication.findMany({
    where: { status: "PENDING" }
  });

  res.json(apps);
}

async function approveApplication(req, res) {
  try {
    const { id } = req.params;

    const application = await prisma.supplierApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // 1️⃣ Update application status
    await prisma.supplierApplication.update({
      where: { id },
      data: { status: "APPROVED" }
    });

    // 2️⃣ Promote existing user to supplier
    await prisma.user.update({
      where: { id: application.userId },
      data: { role: "SUPPLIER" }
    });

    // 3️⃣ Create supplier in inventory service
    await axios.post("http://localhost:4000/inventory/supplier/create", {
      userId: application.userId,
      name: application.organizationName,
      latitude: application.latitude,
      longitude: application.longitude,
      type: application.type
    });

    res.json({ message: "Supplier approved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Approval failed" });
  }
}

async function rejectApplication(req, res) {
  try {
    const { id } = req.params;

    await prisma.supplierApplication.update({
      where: { id },
      data: { status: "REJECTED" }
    });

    res.json({ message: "Application rejected" });

  } catch (error) {
    res.status(500).json({ error: "Rejection failed" });
  }
}

module.exports = {
  getApplications,
  approveApplication,
  rejectApplication
};