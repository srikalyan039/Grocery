const mongoose = require("mongoose");
const Product = require("../models/Product");

// 1. Create a product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, desc, unit } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !category) {
      return res.status(400).json({ msg: "Name, price, and category are required" });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      category: category.toLowerCase(),
      unit,
      desc,
      image,
    });

    return res.status(201).json({ msg: "Product added", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Get all products (with optional search, category, and sorting support)
exports.getProducts = async (req, res) => {
  try {
    const { category, search, sortBy = "createdAt", order = "desc" } = req.query;

    const filter = {};

    // Filter by category if provided
    if (category && category !== "All") {
      filter.category = category.toLowerCase();
    }

    // Filter by name regex if search query provided
    if (search && search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    // Determine sort direction
    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const products = await Product.find(filter).sort(sortOptions);
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Get single product by ID
exports.productById = async (req, res) => {
  try {
    const id = req.params.id || req.params.productId;

    // Validate that the param is a valid 24-character hex MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid product ID format" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};