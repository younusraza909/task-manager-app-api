const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age Must Be Greater Than 0");
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email Is Not Valid");
      }
    },
  },
  password: {
    type: String,
    min: 6,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain word password");
      }
    },
  },
});

module.exports = User;
