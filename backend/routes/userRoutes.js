const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Use camelCase to match exports in userController.js
router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.verifyOtp);

module.exports = router;