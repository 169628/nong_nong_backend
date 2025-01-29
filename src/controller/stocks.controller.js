const MongoConnection = require("../../common/database/mongo.database.connect");

const StockModel = require("../model/stock.model");

module.exports = {
  async create(context) {
    try {
      const data = {
        productId: "6798cf46a1a7295797591f5a",
        stock: [
          {
            warehouse: "線上倉庫",
            showQuantity: "10",
            trueQuantity: "13",
          },
          /*
          {
            warehouse: "台北倉庫",
            showQuantity: "30",
            trueQuantity: "55",
          },*/
          {
            warehouse: "南投倉庫",
            showQuantity: "15",
            trueQuantity: "20",
          },
          /*
          {
            warehouse: "高雄倉庫",
            showQuantity: "20",
            trueQuantity: "40",
          },*/
          {
            warehouse: "嘉義倉庫",
            showQuantity: "13",
            trueQuantity: "14",
          },
        ],
      };
      const result = await StockModel.create(data);
      context.body = result;
    } catch (error) {
      context.body = error;
    }
  },
};
