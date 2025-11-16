// models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  block: {
    type: String,
    enum: ["BH1", "BH2", "GH1", "GH2"],
    required: true,
  },
  roomNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, default: 0 },
  occupants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // student users will be stored here
    },
  ],
  caretakerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // caretaker who created this room
  },
});

roomSchema.index({ block: 1, roomNumber: 1 }, { unique: true }); // no duplicate rooms per block

module.exports = mongoose.model("Room", roomSchema);
