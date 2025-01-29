const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "使用者名稱為必填"],
    },
    carts: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
        },
      },
    ],
    paid: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
