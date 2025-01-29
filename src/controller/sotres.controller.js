const MongoConnection = require("../../common/database/mongo.database.connect");
const { ObjectId } = require("mongoose").Types;

const StoreModel = require("../model/store.model");

module.exports = {
  async create(context) {
    try {
      const data = {
        account: {
          userId: "6798cd940d67245598a325cc",
          userName: "欣穎",
        },
        storeName: "霧峰野趣農舍",
        introTitle: "純天然栽培的香菇與根莖類美味",
        introContent1:
          "霧峰野趣農舍專注於種植高品質的香菇與各式根莖類蔬菜，以純天然無農藥的方式栽培，呈現土地的原始滋味。每一份食材都承載著我們對自然的尊重與用心，讓您品嘗到濃郁風味與健康營養兼具的安心選擇。",
        introContent2:
          "我們的香菇與根莖類食物全程由農舍自行種植，從土壤養護到採收，都堅持友善農業的理念。在霧峰野趣農舍，您不僅能享受最新鮮的農產品，還能感受到返樸歸真的田園魅力，體驗自然、健康與美味的完美結合！",
      };
      const result = await StoreModel.create(data);
      context.body = result;
    } catch (error) {
      context.body = error;
    }
  },
  async get(context) {
    try {
      const result = await StoreModel.aggregate([
        { $match: { storeName: "林氏果園" } },
        {
          $lookup: {
            from: "users",
            localField: "account.userId",
            foreignField: "_id",
            as: "userAccount",
          },
        },
      ]);
      context.body = result;
    } catch (error) {
      context.body = error;
    }
  },
};
