
const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const upload = require("../middlewares/imageMiddleware");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

// 1. Admin action routes
router.post("/", adminMiddleware, upload.single("image"), controller.createProduct);

// 2. Specific / Static GET routes FIRST
router.get("/", controller.getProducts);
router.get("/all-products", controller.getProducts);

// 3. Dynamic / Parameterized routes LAST
router.get("/:id", controller.productById);

module.exports = router;