const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const {
  createUser,
  updateUser,
  retrieveUserLog,
  getUsers,
} = require("./controllers/users");

//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
//get all users
app.get("/api/users", getUsers);
//new user creation
app.post("/api/users", createUser);
//add exercise to existing user
app.post("/api/users/:_id/exercises", updateUser);
//get users exercise log
app.get("/api/users/:_id/logs", retrieveUserLog);

//db connection & backend listener
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .then(() =>
    console.log(
      "Connected to MongoDB \n Your app is listening on port",
      process.env.PORT
    )
  )
  .catch((error) => console.error("Error connecting to MongoDB:", error));
