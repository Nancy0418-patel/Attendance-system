const express = require("express");
const router = express.Router();
const analysis = require("../controllers/attendanceAnalysisController");

// GET /api/attendance-analysis/summary?classId=...&batch=...
router.get("/summary", analysis.getAttendanceSummary);

// GET /api/attendance-analysis/student/:studentId
router.get("/student/:studentId", analysis.getStudentAttendanceDetail);

module.exports = router;
