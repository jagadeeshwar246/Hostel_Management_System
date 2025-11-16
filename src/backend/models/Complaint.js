const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentEmail: String,
  studentName: String,
  roomNumber: String,
  block: String,
  type: {
    type: String,
    enum: [
      "Water Problem",
      "Electricity Problem",
      "Light Issue",
      "Switch Issue",
      "Fan Issue",
      "Room Disturbance",
      "Cleanliness",
      "Outpass Issue",
    ],
    required: true,
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Completed"],
    default: "Pending",
  },
  reply: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Complaint", complaintSchema);
