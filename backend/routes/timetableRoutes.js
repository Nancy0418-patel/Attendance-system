const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");
const Student = require("../models/Student");
const { getTimetableByClassAndDay, getTimetableByTeacherAndDay } = require("../controllers/timetableController");

// 🚀 GET /api/timetable/current/:studentId
router.get("/current/:studentId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const now = new Date();
    const day = now.toLocaleString("en-US", { weekday: "long" });
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    const currentClass = await Timetable.findOne({
      className: student.className,
      day,
      startTime: { $lte: currentTime },
      endTime: { $gt: currentTime },
      $or: [
        { batch: student.batch },
        { batch: null } // general class
      ]
    });

    if (!currentClass) {
      return res.status(200).json({ message: "No class is currently running" });
    }

    res.status(200).json({ success: true, currentClass });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📚 GET /api/timetable/:classId/:dayOfWeek - New route to get timetable by class and day
router.get("/:classId/:dayOfWeek", getTimetableByClassAndDay);

// 👨‍🏫 GET /api/timetable/teacher/:teacherId/:dayOfWeek - New route to get timetable for a specific teacher and day
router.get("/teacher/:teacherId/:dayOfWeek", getTimetableByTeacherAndDay);

module.exports = router;
