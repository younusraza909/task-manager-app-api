const express = require("express");
const User = require("./model/user");
const Task = require("./model/task");
const connectToDb = require("./db/mongoose");
const { update } = require("./model/user");

const app = express();

app.use(express.json());

//Connecting TO Db
connectToDb();

const port = process.env.PORT || 3000;

//TO Create A user
app.post("/users", async (req, res) => {
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

//For Fetching All Users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200);
    res.send(users);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//Update User
app.patch("/users/:id", async (req, res) => {
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

//For Fetching User With ID
app.get("/users/:id", async (req, res) => {
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

//Delete A User With ID
app.delete("/users/:id", async (req, res) => {
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

//To Create A task
app.post("/tasks", async (req, res) => {
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

//For Fetching All Task
app.get("/tasks", async (req, res) => {
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
app.get("/tasks/:id", async (req, res) => {
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

//Update Task By ID
app.patch("/tasks/:id", (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send("Invalid Updates");
  }
  try {
    const task = Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      res.status(404).send("Task Not Found With This ID");
    }
    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

//Delete Task By Id
app.delete("tasks/:id", async (req, res) => {
  try {
    const task = Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).send("Task Not Found With Thid ID");
    }
    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running up on port ${port}`);
});
