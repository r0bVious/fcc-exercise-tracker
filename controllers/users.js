const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("username _id");
    return res.json(users);
  } catch (error) {
    console.log(error);
  }
};

const createUser = async (req, res) => {
  const userName = req.body.username;
  const newUser = new User({ username: userName });

  try {
    const savedUser = await newUser.save();
    res.json({
      username: savedUser.username,
      _id: savedUser._id,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  const { description, duration, date } = req.body;

  let dateString;
  if (date) {
    dateString = new Date(date).toDateString();
  } else {
    dateString = new Date().toDateString();
  }

  const newExerciseObject = {
    description,
    duration: parseInt(duration),
    date: dateString,
  };
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params._id },
      { $push: { log: newExerciseObject }, $inc: { count: 1 } },
      { new: true, upsert: false }
    );

    if (!updatedUser) {
      return res.json({ message: "User not found" });
    }

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      date: newExerciseObject.date,
      duration: newExerciseObject.duration,
      description: newExerciseObject.description,
    });
  } catch (error) {
    console.log(error);
  }
};

const retrieveUserLog = async (req, res) => {
  const paramID = req.params._id;
  const fromParam = req.query.from ? new Date(req.query.from) : null;
  const toParam = req.query.to ? new Date(req.query.to) : null;
  const limitParam = req.query.limit;

  try {
    const foundUser = await User.findById(paramID);

    let filteredLog = foundUser.log.filter((entry) => {
      const entryDate = new Date(entry.date);
      const afterFrom = !fromParam || entryDate >= fromParam;
      const beforeTo = !toParam || entryDate <= toParam;

      return afterFrom && beforeTo;
    });

    if (limitParam) filteredLog = filteredLog.slice(0, limitParam);

    return res.json({
      _id: foundUser._id,
      username: foundUser.username,
      count: foundUser.count,
      log: filteredLog,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUsers, createUser, updateUser, retrieveUserLog };
