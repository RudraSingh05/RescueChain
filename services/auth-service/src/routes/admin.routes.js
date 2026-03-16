const express = require("express");
const {
  getApplications,
  approveApplication,
  rejectApplication
} = require("../services/admin.service");

const router = express.Router();

router.get("/supplier-applications", getApplications);

router.post("/supplier-approve/:id", approveApplication);

router.post("/supplier-reject/:id", rejectApplication);

module.exports = router;