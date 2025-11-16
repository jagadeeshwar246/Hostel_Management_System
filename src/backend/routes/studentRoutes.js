const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// CREATE student
router.post("/", async (req, res) => {
  try {
    const { id, name, age, dept } = req.body;
    await Student.create({ _id: id, name, age, dept });
    res.json({ message: "Student Added ✅" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// READ all students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// UPDATE student
router.put("/:id", async (req, res) => {
  const { name, age, dept } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, age, dept });
  res.json({ message: "Student Updated ✅" });
});

// DELETE student
router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student Deleted ✅" });
});

module.exports = router;
