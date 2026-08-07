const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const {
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
} = require("../services/admin.service");

const router = express.Router();

router.get("/supplier-applications", authenticate, getApplications);

router.post("/supplier-approve/:id", authenticate, approveApplication);

router.post("/supplier-reject/:id", authenticate, rejectApplication);

router.get("/stats", authenticate, getStats);

router.get("/logs", authenticate, getLogs);

router.get("/users", authenticate, getUsers);

router.patch("/users/:id/block", authenticate, blockUser);

router.patch("/users/:id/unblock", authenticate, unblockUser);

router.delete("/users/:id", authenticate, deleteUser);

router.get("/inventory", authenticate, getInventory);

router.get("/inventory/low-stock", authenticate, getLowStock);

module.exports = router;
