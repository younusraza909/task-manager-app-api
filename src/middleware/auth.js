const jwt = require("jsonwebtoken");
const User = require("./../model/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, "thisismyjwtsecret");

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Please Authenticate" });
  }
};

module.exports = auth;
