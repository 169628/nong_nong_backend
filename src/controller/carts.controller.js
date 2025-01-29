const MongoConnection = require("../../common/database/mongo.database.connect");
const mongoose = require("mongoose");

const response = require("../../common/response.message");
const CartModel = require("../model/cart.model");
const UserModel = require("../model/user.model");
const ProductModel = require("../model/product.model");
const checkLogin = require("../../common/check.login");
// const checkId = require("../../common/check.bson");

module.exports = {
  async update(context) {
    try {
      //檢查 id
      const userId = context.request.params.userId;
      const { productId, quantity } = context.request.body;
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return response.failed(context, 400, "update cart", "invalid id");
      }

      //檢查 token
      const tokenResult = await checkLogin.check(context);
      const { id, name } = tokenResult;

      // 先檢查 "check login" 是否有系統錯誤，再檢查 token 是否正確
      if (tokenResult.name == "JsonWebTokenError") {
        return response.failed(
          context,
          500,
          "update cart",
          tokenResult.message || "Internal Server Error"
        );
      } else if (id == undefined || name == undefined) {
        return response.failed(context, 400, "update cart", "please login");
      } else if (id != userId) {
        return response.failed(context, 400, "update cart", "please login");
      }

      // 檢查 productId、quantity
      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return response.failed(
          context,
          400,
          "update cart",
          "invalid productId"
        );
      }
      if (!quantity || Number(quantity) <= 0) {
        return response.failed(
          context,
          400,
          "update cart",
          "quantity is required and must bigger than 0"
        );
      }

      // 檢查使用者存不存在
      const idResult = await UserModel.findById(userId);
      if (idResult == null) {
        return response.failed(
          context,
          400,
          "update cart",
          "the user is not exist"
        );
      }
      // 檢查商品存不存在
      const productResut = await ProductModel.findById(productId);
      if (productResut == null) {
        return response.failed(
          context,
          400,
          "update cart",
          "the product is not exist"
        );
      }
      // 新建購物車
      const result = await CartModel.find({
        userId: new mongoose.Types.ObjectId(id),
        paid: { $exists: false },
      });
      let cart;
      if (result.length <= 0) {
        cart = await CartModel.create({
          userId: userId,
          carts: [{ productId, quantity }],
        });
      } else {
        let inCart = false;
        const data = result[0].carts.map((i) => {
          if (i.productId.toString() == productId) {
            i.quantity = quantity;
            inCart = true;
          }
          return i;
        });
        if (!inCart) {
          data.push({
            productId,
            quantity,
          });
        }
        //cart = data;
        cart = await CartModel.findByIdAndUpdate(
          result[0]._id,
          {
            carts: data,
          },
          { new: true }
        );
      }
      return response.success(context, 201, "update cart", cart);
    } catch (error) {
      console.log("update cart error !", error);
      const result = error.errors;
      return response.failed(
        context,
        500,
        "update cart",
        result || "Internal Server Error"
      );
    }
  },
  async get(context) {
    try {
      // 檢查 id
      const userId = context.request.params.userId;
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return response.failed(context, 400, "get cart", "invalid id");
      }

      // 檢查 token
      const tokenResult = await checkLogin.check(context);
      const { id, name } = tokenResult;

      // 先檢查 "check login" 是否有系統錯誤，再檢查 token 是否正確
      if (tokenResult.name == "JsonWebTokenError") {
        return response.failed(
          context,
          500,
          "get cart",
          tokenResult.message || "Internal Server Error"
        );
      } else if (id == undefined || name == undefined) {
        return response.failed(context, 400, "get cart", "please login");
      } else if (id != userId) {
        return response.failed(context, 400, "get cart", "please login");
      }

      // 檢查使用者存不存在
      const idResult = await UserModel.findById(userId);
      if (idResult == null) {
        return response.failed(
          context,
          400,
          "get cart",
          "the user is not exist"
        );
      }

      const result = await CartModel.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "carts.productId",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            paid: { $exists: false },
          },
        },
      ]);
      return response.success(context, 200, "get cart", result);
    } catch (error) {
      console.log("get cart error !", error);
      const result = error.errors;
      return response.failed(
        context,
        500,
        "get cart",
        result || "Internal Server Error"
      );
    }
  },
  async pay(context) {
    try {
      // 檢查 id
      const userId = context.request.params.userId;
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return response.failed(context, 400, "cart pay", "invalid id");
      }

      // 檢查 token
      const tokenResult = await checkLogin.check(context);
      const { id, name } = tokenResult;

      // 先檢查 "check login" 是否有系統錯誤，再檢查 token 是否正確
      if (tokenResult.name == "JsonWebTokenError") {
        return response.failed(
          context,
          500,
          "cart pay",
          tokenResult.message || "Internal Server Error"
        );
      } else if (id == undefined || name == undefined) {
        return response.failed(context, 400, "cart pay", "please login");
      } else if (id != userId) {
        return response.failed(context, 400, "cart pay", "please login");
      }

      // 檢查使用者存不存在
      const idResult = await UserModel.findById(userId);
      if (idResult == null) {
        return response.failed(
          context,
          400,
          "cart pay",
          "the user is not exist"
        );
      }

      const result = await CartModel.find({
        userId: new mongoose.Types.ObjectId(userId),
        paid: { $exists: false },
      });
      if (result.length <= 0) {
        return response.failed(context, 404, "cart pay", "the cart is empty");
      }
      const cartId = result[0]._id.toString();
      const payResult = await CartModel.findByIdAndUpdate(
        cartId,
        { paid: true },
        { new: true }
      );
      return response.success(context, 201, "cart pay", payResult);
    } catch (error) {
      console.log("cart pay error !", error);
      const result = error.errors;
      return response.failed(
        context,
        500,
        "cart pay",
        result || "Internal Server Error"
      );
    }
  },
};
