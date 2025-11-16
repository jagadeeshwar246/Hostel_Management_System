const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const User = require("../models/User");

/**
 * Caretaker adds or updates a room
 * POST /api/rooms/addOrUpdate
 */
router.post("/addOrUpdate", async (req, res) => {
  try {
    const { caretakerEmail, block, roomNumber, capacity } = req.body;

    if (!block || !roomNumber || !capacity) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Verify caretaker or warden
    const caretaker = await User.findOne({ email: caretakerEmail });
    if (
      !caretaker ||
      (caretaker.role !== "caretaker" && caretaker.role !== "warden")
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Check if room exists
    let room = await Room.findOne({ block, roomNumber });

    if (room) {
      // Update capacity only
      room.capacity = capacity;
      await room.save();
      return res
        .status(200)
        .json({ message: "Room updated successfully.", room });
    } else {
      // Create new room
      room = new Room({
        block,
        roomNumber,
        capacity,
        occupied: 0, // ensure student booking starts from zero
        caretakerId: caretaker._id,
      });
      await room.save();
      return res
        .status(201)
        .json({ message: "Room created successfully.", room });
    }
  } catch (error) {
    console.error("Error in addOrUpdate route:", error);
    res
      .status(500)
      .json({ message: "Server error while adding/updating room." });
  }
});

/**
 * Get all rooms
 * GET /api/rooms/list?email=user@gmail.com
 */
router.get("/list", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Caretaker or warden email required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    let rooms;

    if (user.role === "warden") {
      // Warden sees all rooms
      rooms = await Room.find().populate("caretakerId", "name email");
    } else if (user.role === "caretaker") {
      // Caretaker sees only their rooms
      rooms = await Room.find({ caretakerId: user._id });
    } else {
      return res.status(403).json({ message: "Access denied." });
    }

    return res.status(200).json(rooms);
  } catch (error) {
    console.error("Error in room list route:", error);
    res.status(500).json({ message: "Error fetching rooms." });
  }
});

module.exports = router;
