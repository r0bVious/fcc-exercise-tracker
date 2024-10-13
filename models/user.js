const mongoose = require("mongoose");
const exerciseSchema = require("./exercise");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  count: { type: Number, default: 0 },
  log: [exerciseSchema],
});

module.exports = mongoose.model("User", userSchema);
