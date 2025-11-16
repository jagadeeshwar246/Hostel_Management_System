const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const studentBookRoutes = require("./routes/studentBookRoutes");
const wardenRoutes = require("./routes/wardenRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
// ✅ Single, clean CORS setup
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect("mongodb+srv://hms:hms2520@cluster0.22yznvo.mongodb.net/hms")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Register Routes
app.use("/api/student", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/student-book", studentBookRoutes);
app.use("/api/warden", wardenRoutes);
app.use("/api/complaints", complaintRoutes);

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
