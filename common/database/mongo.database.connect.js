// File For Mongo Database Connection

const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Mongodb Connected !");
    const db = await mongoose.connection;
    return db;
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectMongo();
