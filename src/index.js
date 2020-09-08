const express = require("express");
const connectToDb = require("./db/mongoose");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

//Connecting TO Db
connectToDb();

//Using Routes As Middleware
app.use("/users", require("./routes/user"));
app.use("/tasks", require("./routes/task"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running up on port ${port}`);
});
