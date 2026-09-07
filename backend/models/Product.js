const mongoose = require("mongoose");

const Category_Enum = [
  "vegetables",
  "fruits",
  "food-grains",
  "meat"
];

const Unit_Enum = [
  "500g",
  "1kg",
  "2kgs",
  "5kgs"
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      enum: {
        values: Category_Enum,
        message: "{VALUE} is not a valid category",
      },
      required: [true, "Category is required"],
      lowercase: true,
      trim: true,
    },
    unit: {
      type: String,
      enum: {
        values: Unit_Enum,
        message: "{VALUE} is not a valid unit",
      },
      required: [true, "Unit is required"],
    },
    image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookups & search
productSchema.index({ name: "text" });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model("Product", productSchema);