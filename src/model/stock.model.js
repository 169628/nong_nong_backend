const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "products",
      required: [true, "product ID 未填寫"],
    },
    stock: [
      {
        warehouse: {
          type: String,
        },
        showQuantity: {
          type: Number,
        },
        trueQuantity: {
          type: Number,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
