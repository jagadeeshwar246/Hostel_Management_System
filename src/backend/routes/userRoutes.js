// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");

// // POST /api/users/addUser
// router.post("/addUser", async (req, res) => {
//   try {
//     const { name, email, photoURL } = req.body;

//     // if (!email.endsWith("@rguktrkv.ac.in")) {
//     //   return res.status(400).json({ message: "Invalid email domain" });
//     // }

//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (!user) {
//       user = new User({ name, email, photoURL });
//       await user.save();
//     }

//     res.status(200).json({ message: "User saved successfully", user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/users/addUser (Google Login handler)
router.post("/addUser", async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    // 1️⃣ Find existing user
    let user = await User.findOne({ email });

    // 2️⃣ If user doesn’t exist → create new student by default
    if (!user) {
      user = new User({
        name,
        email,
        photoURL,
        role: "student", // default
      });
      await user.save();
    }

    // 3️⃣ Send role info for frontend redirection
    res.status(200).json({
      message: "User logged in successfully",
      user,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ (Warden only) - Promote or demote user roles
// PUT /api/users/updateRole
router.put("/updateRole", async (req, res) => {
  try {
    const { email, newRole, wardenEmail } = req.body;

    // Only warden can modify roles
    const warden = await User.findOne({ email: wardenEmail });
    if (!warden || warden.role !== "warden") {
      return res.status(403).json({ message: "Access denied — not a warden" });
    }

    // Update target user’s role
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { role: newRole },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `Role updated to ${newRole}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all users (warden view)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
