const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const User = require("../models/User");

// 🧩 Fetch all vacant rooms (sorted by block order)
router.get("/vacant", async (req, res) => {
  try {
    // fetch rooms with occupied < capacity
    const rooms = await Room.find({
      $expr: { $lt: ["$occupied", "$capacity"] },
    });

    // manual sort order
    const blockOrder = { BH1: 1, BH2: 2, GH1: 3, GH2: 4 };
    rooms.sort((a, b) => blockOrder[a.block] - blockOrder[b.block]);

    res.status(200).json(rooms);
  } catch (err) {
    console.error("Error fetching vacant rooms:", err);
    res.status(500).json({ message: "Error fetching vacant rooms" });
  }
});

// 🧩 Book a room
router.post("/book", async (req, res) => {
  try {
    const { email, block, roomNumber } = req.body;

    const student = await User.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.status === "allocated") {
      return res.status(400).json({ message: "You already booked a room" });
    }

    const room = await Room.findOneAndUpdate(
      { block, roomNumber, $expr: { $lt: ["$occupied", "$capacity"] } },
      { $inc: { occupied: 1 } },
      { new: true }
    );

    if (!room)
      return res.status(400).json({ message: "Room full or not found" });

    // update student details
    student.blockAssigned = block;
    student.roomNumber = roomNumber;
    student.status = "allocated";
    await student.save();

    res.status(200).json({
      message: `You booked Room ${roomNumber} in Block ${block}`,
      room,
      student,
    });
  } catch (err) {
    console.error("Error booking room:", err);
    res.status(500).json({ message: "Error booking room" });
  }
});
// 🧩 Get student's booked room info
router.get("/myroom/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const student = await User.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // if student hasn’t booked yet
    if (student.status !== "allocated") {
      return res.status(200).json({
        message: "You haven’t booked any room yet.",
        booked: false,
      });
    }

    // if booked
    res.status(200).json({
      booked: true,
      block: student.blockAssigned,
      roomNumber: student.roomNumber,
      message: `You booked Room ${student.roomNumber} in Block ${student.blockAssigned}`,
    });
  } catch (err) {
    console.error("Error fetching student's booked room:", err);
    res.status(500).json({ message: "Error fetching booked room info" });
  }
});

module.exports = router;
