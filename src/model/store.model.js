const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    account: {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "user ID 未填寫"],
      },
      userName: {
        type: String,
        required: [true, "user name 未填寫"],
      },
    },
    storeName: {
      type: String,
      require: [true, "店名為必填"],
    },
    introTitle: {
      type: String,
      require: [true, "標題為必填"],
    },
    introContent1: {
      type: String,
      require: [true, "簡介內容為必填"],
    },
    introContent2: {
      type: String,
    },
    introContent3: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
