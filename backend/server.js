// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

const attendanceRoutes = require("./routes/attendanceRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const participationRoutes = require("./routes/participationRoutes");
const notificationRoutes = require("./routes/notifications");
const timetableRoutes = require("./routes/timetableRoutes");
const authRoutes = require("./routes/authRoutes");
const Student = require("./models/Student");
const Teacher = require("./models/Teacher");
const Class = require("./models/Class");
const emailRoutes = require("./routes/emailRoutes");
const attendanceAnalysisRoutes = require("./routes/attendanceAnalysisRoutes");

const app = express();
app.use(cors());
// CORS configuration
const allowedOrigins = [
  'http://localhost:3000', // Your local frontend
  'https://attendance-system-frontend1.onrender.com' // Your deployed frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Attendance Management API running");
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.error(err));

app.use("/api/attendance", attendanceRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/participations", participationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance-analysis", attendanceAnalysisRoutes);

app.get("/api/dashboard", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalClasses = await Class.countDocuments();

    res.json({
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        presentToday: 0, // Placeholder
        pendingNotifications: 0 // Placeholder
      },
      recentActivity: [] // Placeholder
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
