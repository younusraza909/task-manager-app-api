const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const dataBaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  async (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }

    const db = client.db(dataBaseName);

    await db.collection("user").insertOne(
      {
        name: "Raza",
        age: 20,
      },
      (error, result) => {
        if (error) {
          return console.log("unable To indert user");
        }
        console.log(result.ops);
      }
    );
  }
);
