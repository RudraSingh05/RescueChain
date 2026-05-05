const express = require("express");
const { applySupplier } = require("../services/supplier.service");
const { authenticate } = require("../middleware/auth.middleware");


const router = express.Router();

router.post("/apply", authenticate, applySupplier);

module.exports = router;