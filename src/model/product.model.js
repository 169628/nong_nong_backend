const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "商品名稱為必填"],
    },
    subTitle: {
      type: String,
      required: [true, "副標為必填"],
    },
    unit: {
      type: String,
      require: [true, "單位為必填"],
    },
    price: {
      type: Number,
      require: [true, "價格為必填"],
    },
    originalPrice: {
      type: Number,
      require: [true, "原價為必填"],
    },
    storeId: {
      type: mongoose.Schema.ObjectId,
      ref: "stores",
      required: [true, "store ID 未填寫"],
    },
    category: {
      type: String,
      require: [true, "種類為必填"],
      enum: ["葉菜類", "根莖瓜果類", "菌菇類", "安心水果類"],
    },
    tags: {
      keywords: [{ type: String }],
      productType: [{ type: String }],
    },
    area: {
      type: String,
      require: [true, "地區為必填"],
    },
    stockId: {
      type: mongoose.Schema.ObjectId,
      ref: "stockId",
      required: [true, "stock ID 未填寫"],
    },
  },
  {
    versionKey: false,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
