const mongoose = require("mongoose");
const validator = require("validator");

const connectToDb = () => {
  try {
    mongoose.connect(process.env.MongoURI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Connect To DataBase");
  } catch (error) {
    console.log(("Error", error));
  }
};

module.exports = connectToDb;
