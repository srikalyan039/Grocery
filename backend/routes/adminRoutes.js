const express = require("express");
const router = express.Router();

const controller = require("../admin/register");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

// Public admin authentication routes
router.post("/register", controller.register);
router.post("/login", controller.login);

module.exports = router;