const MongoConnection = require("../../common/database/mongo.database.connect");
const mongoose = require("mongoose");

const ProductModel = require("../model/product.model");
const response = require("../../common/response.message");

module.exports = {
  async create(context) {
    try {
      //const { name, email, password, role } = context.request.body;
      const data = {
        name: "馬鈴薯",
        subTitle: "馬鈴薯粉糯，適合煮湯、燉煮或製作馬鈴薯泥，營養豐富。",
        unit: "3顆/包",
        price: 90,
        originalPrice: 110,
        storeId: "6798ce715f2e9487bc786888",
        category: "根莖瓜果類",
        tags: {
          keywords: ["產地直送"],
          productType: ["捐贈", "熱門商品"],
        },
        area: "中部",
        stockId: "6798cfa33648c677f8110017",
      };
      const result = await ProductModel.create(data);
      context.body = result;
    } catch (error) {
      const result = error.errors;
      return response.failed(
        context,
        500,
        "create product",
        result || "Internal Server Error"
      );
    }
  },
  async get(context) {
    try {
      const page = Number(context.request.query.page) || 1;
      const search = context.request.query.search || "";

      if (page < 0) {
        return response.failed(context, 400, "get products", "invalid page");
      }

      const result = await ProductModel.aggregate([
        {
          $lookup: {
            from: "stores",
            localField: "storeId",
            foreignField: "_id",
            as: "storeInfo",
          },
        },
        {
          $lookup: {
            from: "advertises",
            localField: "category",
            foreignField: "category",
            as: "advertise",
          },
        },
        {
          $lookup: {
            from: "stocks",
            localField: "stockId",
            foreignField: "_id",
            as: "stockQuantity",
          },
        },
        {
          $match: {
            $or: [
              { name: { $regex: search } },
              { subTitle: { $regex: search } },
              { category: { $regex: search } },
              { "tags.keywords": { $regex: search } },
              { "tags.productType": { $regex: search } },
            ],
          },
        },
        {
          $facet: {
            results: [{ $skip: (page - 1) * 16 }, { $limit: 16 }],
            total: [{ $count: "count" }],
          },
        },
      ]);
      return response.success(context, 200, "get products", result);
    } catch (error) {
      console.log("get products error !", error);
      const result = error.errors;
      return response.failed(
        context,
        500,
        "get products",
        result || "Internal Server Error"
      );
    }
  },
  async getOne(context) {
    try {
      const id = context.request.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return response.failed(context, 400, "get one product", "invalid id");
      }

      const _id = new mongoose.Types.ObjectId(id);

      const result = await ProductModel.aggregate([
        {
          $lookup: {
            from: "stores",
            localField: "storeId",
            foreignField: "_id",
            as: "storeInfo",
          },
        },
        {
          $lookup: {
            from: "advertises",
            localField: "category",
            foreignField: "category",
            as: "advertise",
          },
        },
        {
          $lookup: {
            from: "stocks",
            localField: "stockId",
            foreignField: "_id",
            as: "stockQuantity",
          },
        },
        {
          $match: {
            _id,
          },
        },
      ]);

      if (result.length == 0) {
        return response.failed(
          context,
          404,
          "get one product",
          "this id does not exist"
        );
      }

      return response.success(context, 200, "get one product", result);
    } catch (error) {
      console.log("get one product error !", error);
      const result = error.errors;
      return response.failed(
        context,
        500,
        "get one product",
        result || "Internal Server Error"
      );
    }
  },
};
