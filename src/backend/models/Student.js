const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  _id: String,
  name: String,
  age: Number,
  dept: String
});

module.exports = mongoose.model("Student", StudentSchema);

