const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.databaseURI);
    console.log(
      "\x1b[32m%s\x1b[0m",
      `>>>  POS-DB Connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      `❌ Database connection failed: ${error.message}`
    );
    process.exit();
  }
};

module.exports = connectDB;
