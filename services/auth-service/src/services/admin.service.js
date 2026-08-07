const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getApplications(req, res) {
  const apps = await prisma.supplierApplication.findMany({
    where: { status: "PENDING" },
  });

  res.json(apps);
}

async function approveApplication(req, res) {
  try {
    const { id } = req.params;

    // 🔒 Admin check
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only admin allowed" });
    }

    const application = await prisma.supplierApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // ✅ Check if already approved
    if (application.status === "APPROVED") {
      return res.status(400).json({ error: "Already approved" });
    }

    // ✅ Check if supplier already exists (IMPORTANT)
    const existingSupplier = await prisma.user.findUnique({
      where: { id: application.userId },
    });

    if (existingSupplier?.role === "SUPPLIER") {
      return res.status(400).json({ error: "Supplier already exists" });
    }

    console.log("Calling inventory service...");

    // 1️⃣ Create supplier in inventory service
    await axios.post(
      "http://localhost:4000/inventory/admin/supplier/create",
      {
        userId: application.userId,
        name: application.organizationName,
        latitude: application.latitude,
        longitude: application.longitude,
        type: application.type,
      },
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    // 2️⃣ Update application status
    await prisma.supplierApplication.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    // 3️⃣ Promote user to supplier
    await prisma.user.update({
      where: { id: application.userId },
      data: { role: "SUPPLIER" },
    });

    // 4️⃣ Add activity log (we’ll define model next)
    await prisma.activityLog.create({
      data: {
        action: `Approved supplier ${application.organizationName}`,
        userId: req.user.userId,
      },
    });

    res.json({ message: "Supplier approved successfully" });
  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Approval failed" });
  }
}

async function rejectApplication(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only admin allowed" });
    }

    const application = await prisma.supplierApplication.findUnique({
      where: { id },
    });

    await prisma.supplierApplication.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    // ✅ Log
    await prisma.activityLog.create({
      data: {
        action: `Rejected supplier ${application.organizationName}`,
        userId: req.user.userId,
      },
    });

    res.json({ message: "Application rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Rejection failed" });
  }
}

async function getStats(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const users = await prisma.user.count();

    const suppliers = await prisma.user.count({
      where: { role: "SUPPLIER" },
    });

    const pending = await prisma.supplierApplication.count({
      where: { status: "PENDING" },
    });

    res.json({
      users,
      suppliers,
      pending,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}

async function getLogs(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
}

async function getUsers(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

async function blockUser(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.update({
      where: { id },
      data: { status: "BLOCKED" },
    });

    await prisma.activityLog.create({
      data: {
        action: `Blocked user ${user.name} [${user.email}]`,
        userId: req.user.userId,
      },
    });

    res.json({ message: "User blocked" });
  } catch (error) {
    res.status(500).json({ error: "Failed to block user" });
  }
}

async function unblockUser(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.update({
      where: { id },
      data: { status: "ACTIVE" },
    });

    await prisma.activityLog.create({
      data: {
        action: `Unblocked user ${user.name} [${user.email}]`,
        userId: req.user.userId,
      },
    });

    res.json({ message: "User unblocked" });
  } catch (error) {
    res.status(500).json({ error: "Failed to unblock user" });
  }
}

async function deleteUser(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: `Deleted user ${user.name} [${user.email}]`,
        userId: req.user.userId,
      },
    });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
}

async function getInventory(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const response = await axios.get("http://localhost:4000/inventory/admin/all", {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
}

async function getLowStock(req, res) {
  try {
    const response = await axios.get("http://localhost:4000/inventory/admin/low-stock", {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch low stock" });
  }
}

module.exports = {
  getApplications,
  approveApplication,
  rejectApplication,
  getStats,
  getLogs,
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getInventory,
  getLowStock,
};
