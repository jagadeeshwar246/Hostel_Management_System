const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const User = require("../models/User");

// 🧭 Get full warden dashboard data
router.get("/dashboard", async (req, res) => {
  try {
    // Get all rooms
    const rooms = await Room.find().lean();

    // Get all students with allocated rooms
    const students = await User.find({ status: "allocated" })
      .select("name email blockAssigned roomNumber")
      .lean();

    // Combine students under each room
    const roomData = rooms.map((room) => {
      const assignedStudents = students.filter(
        (s) =>
          s.blockAssigned === room.block && s.roomNumber === room.roomNumber
      );
      return {
        ...room,
        vacancies: room.capacity - room.occupied,
        students: assignedStudents,
      };
    });

    // Calculate summary
    const totalRooms = rooms.length;
    const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
    const totalOccupied = rooms.reduce((sum, r) => sum + r.occupied, 0);

    res.status(200).json({
      summary: {
        totalRooms,
        totalCapacity,
        totalOccupied,
        totalVacant: totalCapacity - totalOccupied,
      },
      roomData,
    });
  } catch (error) {
    console.error("Error fetching warden dashboard:", error);
    res.status(500).json({ message: "Error fetching warden dashboard data" });
  }
});

module.exports = router;
