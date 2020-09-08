const express = require("express");
const router = express.Router();
const User = require("./../model/user");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

//To Login User
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("Unable to login");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      res.status(400).send("Unable to login");
    }
    //Sending Token

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

//To LogOut User
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(console.error(error));
  }
});

//To Logout User From All Session
router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send("Logged Out Successfully");
  } catch (error) {
    res.status(500).send(console.error(error));
  }
});

//For Fetching Current Users
router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

//For Fetching User With ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("No User Found");
    }

    res.status(200);
    res.send(user);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//TO Create A user
router.post("/", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

//Update User
router.patch("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send("Error", "Invalid Updates");
  }
  try {
    const user = await User.findById(req.params.id);

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    //FindByIdAndUpdate bypasses mongoose thats wht will not hit middleware of mongoose
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!user) {
      res.status(404).send("No User Found With This ID");
    }
    res.send(user);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//Delete A User With ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send("No User Found");
    }

    res.status(200);
    res.send(user);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

module.exports = router;
