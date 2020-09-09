const express = require("express");
const router = express.Router();
const Task = require("./../model/task");
const auth = require("./../middleware/auth");

//For Fetching All Task
router.get("/", auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  try {
    // const tasks = await Task.findMany({ owner: req.user._id });

    // populate ask for more option we can pass to query data
    // await req.user.populate("tasks").execPopulate();

    await req.user
      .populate({
        path: "tasks",
        match: match,
      })
      .execPopulate();

    res.status(200);
    res.send(req.user.tasks);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//For Fetching Task With ID
router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send("No Task Found");
    }
    res.status(200);
    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//To Create A task
router.post("/", auth, async (req, res) => {
  try {
    // const task = new Task(req.body);
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });

    await task.save();

    res.status(200);
    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//Update Task By ID
router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send("Error", "Invalid Updates");
  }
  try {
    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    // new: true,
    // runValidators: true,
    // });

    if (!task) {
      res.status(404).send("No task Found With This ID");
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//Delete Task By Id
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send("No Task Found");
    }

    res.status(200);
    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

module.exports = router;
