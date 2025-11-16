const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const User = require("../models/User");

/**
 * 🧍 Student - Create a complaint
 */
router.post("/create", async (req, res) => {
  try {
    const { studentEmail, type, description } = req.body;

    const student = await User.findOne({ email: studentEmail });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const complaint = new Complaint({
      studentId: student._id,
      studentEmail,
      studentName: student.name,
      roomNumber: student.roomNumber,
      block: student.blockAssigned,
      type,
      description,
    });

    await complaint.save();
    res
      .status(201)
      .json({ message: "Complaint submitted successfully", complaint });
  } catch (err) {
    console.error("Error creating complaint:", err);
    res.status(500).json({ message: "Error creating complaint" });
  }
});

/**
 * 🧍 Student - View their own complaints
 */
router.get("/myComplaints/:email", async (req, res) => {
  try {
    const complaints = await Complaint.find({
      studentEmail: req.params.email,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching student complaints:", err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
});

/**
 * 🧑‍🔧 Caretaker/Warden - View all complaints
 */
router.get("/all", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching all complaints:", err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
});

/**
 * 🧑‍🔧 Caretaker/Warden - Reply or update status
 */
router.put("/reply/:id", async (req, res) => {
  try {
    const { reply, status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { reply, status },
      { new: true }
    );
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });
    res.status(200).json({ message: "Complaint updated", complaint });
  } catch (err) {
    console.error("Error replying complaint:", err);
    res.status(500).json({ message: "Error updating complaint" });
  }
});

/**
 * 🧍 Student - Mark as completed
 */
router.put("/complete/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true }
    );
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });
    res.status(200).json({ message: "Marked as completed", complaint });
  } catch (err) {
    console.error("Error completing complaint:", err);
    res.status(500).json({ message: "Error completing complaint" });
  }
});

module.exports = router;
