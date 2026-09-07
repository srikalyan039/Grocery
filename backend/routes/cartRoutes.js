const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const { userMiddleware } = require("../middlewares/userMiddleware");

// Apply userMiddleware across cart endpoints
router.get("/", userMiddleware, cartController.getCart);
router.post("/", userMiddleware, cartController.addToCart);
router.put("/", userMiddleware, cartController.updateQuantity);
router.delete("/:productId", userMiddleware, cartController.removeFromCart);

module.exports = router;