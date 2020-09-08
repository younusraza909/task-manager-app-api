const express = require("express");
const router = express.Router();
const Task = require("./../model/task");

//For Fetching All Task
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});

    res.status(200);
    res.send(tasks);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//For Fetching Task With ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

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
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);

    await task.save();

    res.status(200);
    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//Update Task By ID
router.patch("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send("Error", "Invalid Updates");
  }
  try {
    const task = await Task.findById(req.params.id);
    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    // new: true,
    // runValidators: true,
    // });

    if (!task) {
      res.status(404).send("No task Found With This ID");
    }
    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//Delete Task By Id
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send("No User Found");
    }

    res.status(200);
    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

module.exports = router;
