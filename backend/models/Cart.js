const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    unit: {
      type: String,
      default: "1kg",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate total price using the item's stored unit price
cartSchema.virtual("totalPrice").get(function () {
  if (!this.items || this.items.length === 0) return 0;
  return this.items.reduce((sum, item) => {
    // Prefer the item's custom unit price; fallback to populated product base price
    const itemPrice =
      item.price ?? (item.product && item.product.price ? item.product.price : 0);
    return sum + itemPrice * item.quantity;
  }, 0);
});

module.exports = mongoose.model("Cart", cartSchema);