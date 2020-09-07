const mongoose = require("mongoose");
const validator = require("validator");

const connectToDb = () => {
  try {
    mongoose.connect(
      "mongodb+srv://Raza909:Raza909@task-manager-app.nx81a.mongodb.net/task-manager-api?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    );
    console.log("Connect To DataBase");
  } catch (error) {
    console.log(("Error", error));
  }
};

module.exports = connectToDb;
