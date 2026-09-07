const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { productId, quantity = 1, unit = "1kg", price } = req.body;

    const qty = Number(quantity);
    if (qty < 1) {
      return res.status(400).json({ msg: "Please enter a valid quantity" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Use passed price or fallback to product base price
    const finalPrice = price ? Number(price) : productExists.price;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity: qty,
            unit,
            price: finalPrice,
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Cart created & product added",
        cart,
      });
    }

    const pid = productId.toString();

    // Match both product ID AND selected unit so 1kg and 5kg don't overwrite each other
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === pid && item.unit === unit
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({
        product: productId,
        quantity: qty,
        unit,
        price: finalPrice,
      });
    }

    await cart.save();

    return res.json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const cart = await Cart.findOne({ user: userId })
      .populate("user", "email")
      .populate("items.product");

    if (!cart) {
      return res.json({ success: true, cart: { items: [] } });
    }

    return res.json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const productId = req.params.productId || req.params.id;
    const { unit } = req.query;

    const pullCondition = { product: productId };
    if (unit) {
      pullCondition.unit = unit;
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: pullCondition } },
      { new: true }
    ).populate("items.product");

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    return res.json({
      success: true,
      message: "Product removed",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { productId, quantity, unit } = req.body;
    const qty = Number(quantity);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const pid = productId.toString();

    // Match item by product ID and optionally unit
    const itemIndex = cart.items.findIndex((item) => {
      if (unit) {
        return item.product.toString() === pid && item.unit === unit;
      }
      return item.product.toString() === pid;
    });

    if (itemIndex === -1) {
      return res.status(404).json({ msg: "Product not in cart" });
    }

    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();

    return res.json({
      success: true,
      message: qty <= 0 ? "Product removed" : "Quantity updated",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};