// Controller File: Users

const MongoConnection = require("../../common/database/mongo.database.connect");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const response = require("../../common/response.message");
const UserModel = require("../model/user.model");
const checkLogin = require("../../common/check.login");

module.exports = {
  async register(context) {
    try {
      const { name, email, password } = context.request.body;

      // 檢查是否為空值
      if (!name) {
        return response.failed(context, 400, "register", "name is required");
      } else if (!email) {
        return response.failed(context, 400, "register", "email is required");
      } else if (!password) {
        return response.failed(
          context,
          400,
          "register",
          "password is required"
        );
      }
      /*else if (!role) {
        return response.failed(context, 400, "register", "role is required");
      }*/

      // 檢查格式
      if (!validator.isLength(name, { min: 1, max: 20 })) {
        return response.failed(
          context,
          400,
          "register",
          "name limit 20 characters"
        );
      } else if (!validator.isEmail(email)) {
        return response.failed(context, 400, "register", "invalid email");
      } else if (!validator.isLength(password, { min: 6, max: 15 })) {
        return response.failed(
          context,
          400,
          "register",
          "password should be between 6 and 15 characters"
        );
      }
      /*else if (role != "consumer" && role != "farmer") {
        return response.failed(
          context,
          400,
          "register",
          "role should be 'consumer' or 'farmer'"
        );
      }*/

      // 一個帳號只能註冊一次
      const checkAccount = await UserModel.findOne({ email });
      if (checkAccount != null) {
        return response.failed(
          context,
          400,
          "register",
          "this email already exists"
        );
      }
      // 加密
      const newPassword = await bcrypt.hash(password, 12);
      // 存檔
      const userData = { name, email, role: "consumer", password: newPassword };
      const result = await UserModel.create(userData);
      const data = {
        name: result.name,
        email: result.email,
      };
      return response.success(context, 201, "register", data);
    } catch (error) {
      console.log("register error !", error);
      const result = error.errors;
      return response.failed(
        context,
        500,
        "register",
        result || "Internal Server Error"
      );
    }
  },
  async login(context) {
    try {
      const { email, password } = context.request.body;

      // 檢查是否為空值
      if (!email) {
        return response.failed(context, 400, "login", "email is required");
      } else if (!password) {
        return response.failed(context, 400, "login", "password is required");
      }

      // 檢查格式
      if (!validator.isEmail(email)) {
        return response.failed(context, 400, "login", "invalid email");
      } else if (!validator.isLength(password, { min: 6, max: 15 })) {
        return response.failed(
          context,
          400,
          "login",
          "password should be between 6 and 15 characters"
        );
      }

      const result = await UserModel.findOne({ email });
      // 沒有此帳號
      if (result == null) {
        return response.failed(
          context,
          404,
          "login",
          "this email does not exist"
        );
      }
      // 比對密碼
      const _password = result.password;
      const checkPassword = await bcrypt.compare(password, _password);
      if (!checkPassword) {
        return response.failed(context, 400, "login", "wrong password");
      }
      const token = jwt.sign(
        { id: result._id, name: result.name },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_DAY,
        }
      );
      const data = {
        user: result.name,
        userId: result._id,
        token,
      };
      return response.success(context, 200, "login", data);
    } catch (error) {
      console.log("login error !", error);
      const result = error.errors;
      return response.failed(
        context,
        500,
        "login",
        result || "Internal Server Error"
      );
    }
  },
  async check(context) {
    try {
      const result = await checkLogin.check(context);
      const { id, name } = result;

      // 先檢查 "check login" 是否有系統錯誤，再檢查 token 是否正確
      if (result.name == "JsonWebTokenError") {
        return response.failed(
          context,
          500,
          "check login",
          result.message || "Internal Server Error"
        );
      } else if (id == undefined || name == undefined) {
        const data = { login: false };
        return response.success(context, 200, "check login", data);
      }

      const data = { login: true, id, name };
      return response.success(context, 200, "check login", data);
    } catch (error) {
      console.log("check login api error !", error);
      const result = error.errors;
      return response.failed(
        context,
        500,
        "check login",
        result || "Internal Server Error"
      );
    }
  },
};
