// User Model File

const mongoose = require("mongoose");

// Create User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "姓名為必填"],
    },
    email: {
      type: String,
      require: [true, "電子信箱為必填"],
    },
    password: {
      type: String,
      require: [true, "密碼為必填"],
    },
    role: {
      type: String,
      require: [true, "身份為必填"],
      enum: ["consumer", "farmer"],
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
