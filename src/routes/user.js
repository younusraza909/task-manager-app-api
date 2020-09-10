const express = require("express");
const router = express.Router();
const User = require("./../model/user");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

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
    //in res.send express call json.stringify behind the scene
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
router.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send("Error", "Invalid Updates");
  }
  try {
    //Upodated Version
    // const user = await User.findById(req.params.id);
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    //FindByIdAndUpdate bypasses mongoose thats wht will not hit middleware of mongoose
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.send(user);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//Delete A User With ID
router.delete("/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(404).send("No User Found");
    // }

    await req.user.remove();

    res.status(200);
    res.send("user deleted successfully");
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//To Get Images from User
//PreProcessing
const avatar = multer({
  // dest: "avatar",
  //we can save file to directory by adding dest property but it will not get access in route so we remove it so multer will give its access to routes
  limits: {
    fileSize: 1000000, //here 1 million is equal to 1mb
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("File Should Be jpg,jpeg,png"));
    }
    cb(undefined, true);
  },
});
//Route For Getting Image
router.post(
  "/me/avatar",
  auth,
  avatar.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    //to get access to file buffer only available if dest not given in multer
    req.user.avatar = buffer;
    await req.user.save();
    res.send();

    //in order to use thi sbuffer in html
    // <img src="data:image/jpg;base64,bufferString" />
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//TO Delete avater for a user
router.delete("/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;

    await req.user.save();

    res.send(200);
  } catch (error) {
    res.status(400).send("Unable To Delete Avatar");
  }
});

//For Fetching Avatar
router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    //Setting header to tell user  image type
    //usually we dont want to set it express set it for us but in image condition we have to
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
