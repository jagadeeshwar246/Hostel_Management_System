const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  photoURL: String,
  role: {
    type: String,
    enum: ["student", "caretaker", "warden"],
    default: "student",
  },

  phone: String,
  permanentAddress: String,
  presentAddress: String,
  blockAssigned: String,
  roomNumber: String,
  status: {
    type: String,
    default: "pending", // pending | allocated
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
