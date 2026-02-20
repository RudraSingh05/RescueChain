const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.get("/admin", authenticate, authorize("ADMIN"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

module.exports = router;