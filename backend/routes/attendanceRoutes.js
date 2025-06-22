// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const { markAttendance, getAttendanceByStudent } = require("../controllers/attendanceController");

router.post("/", markAttendance);                        // POST /api/attendance
router.get("/:studentId", getAttendanceByStudent);       // GET /api/attendance/:studentId

module.exports = router;
