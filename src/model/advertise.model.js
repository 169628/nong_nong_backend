const mongoose = require("mongoose");

const advertiseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      require: [true, "種類為必填"],
    },
    description: [
      {
        title: {
          type: String,
          require: [true, "描述標題為必填"],
        },
        content1: {
          type: String,
          require: [true, "描述內容為必填"],
        },
        content2: {
          type: String,
        },
        content3: {
          type: String,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const Advertise = mongoose.model("Advertise", advertiseSchema);

module.exports = Advertise;
