const MongoConnection = require("../../common/database/mongo.database.connect");

const AdvertiseModel = require("../model/advertise.model");

module.exports = {
  async create(context) {
    try {
      const data = {
        category: "葉菜類",
        description: [
          {
            title: "自然有機純淨耕作",
            content1:
              "這份清甜高麗菜，來自當地小農的有機農田。他們秉持自然耕作理念，杜絕化學農藥與人工肥料，依循四季節氣栽種，讓每顆高麗菜吸收純淨的陽光與雨露。每一片翠綠葉子，都是大地的自然恩賜與小農的細心成果",
          },
          {
            title: "營養豐富健康之選",
            content1:
              "高麗菜被譽為「天然的營養寶庫」，富含膳食纖維、維生素C、K，以及多種抗氧化成分，有助於促進消化、增強免疫力。選用這款有機高麗菜，不僅滿足味蕾，還為全家帶來營養與健康的雙重保障。",
          },
          {
            title: "新鮮直送幸福滋味",
            content1:
              "有機高麗菜從採收至配送，全程保持低溫控管，確保葉片的新鮮與營養不流失。剖開高麗菜，翠綠飽滿的葉片間散發出自然的清香。從田間直送到您的餐桌，讓健康與新鮮隨時相伴。",
            content2:
              "選擇這款有機清甜高麗菜，品味自然、健康與營養的極致融合，為家人的每一餐增添自然的幸福！",
          },
        ],
      };
      const result = await AdvertiseModel.create(data);
      context.body = result;
    } catch (error) {
      context.body = error;
    }
  },
};
