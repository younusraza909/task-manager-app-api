const express = require("express");
const router = express.Router();
const User = require("./../model/user");

//For Fetching All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200);
    res.send(users);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
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
  try {
    const user = new User(req.body);

    await user.save();

    res.status(200);
    res.send(user);
  } catch (error) {
    res.status(400);
    res.send(error);
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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
