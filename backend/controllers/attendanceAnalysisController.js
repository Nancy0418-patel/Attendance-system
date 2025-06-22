// controllers/attendanceAnalysisController.js
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// Get attendance summary for all students in a class or batch
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { classId, batch } = req.query;
    let filter = {};
    if (classId) filter.classId = classId;
    if (batch) filter.batch = batch;

    // Get all students in the class/batch
    const students = await Student.find(filter).populate('classId');
    const summary = [];
    for (const student of students) {
      const total = await Attendance.countDocuments({ studentId: student._id });
      const present = await Attendance.countDocuments({ studentId: student._id, status: "Present" });
      const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
      summary.push({
        studentId: student._id,
        name: student.firstName + " " + student.lastName,
        rollNumber: student.rollNumber,
        className: student.classId && student.classId.className ? student.classId.className : 'N/A',
        total,
        present,
        percentage,
      });
    }
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get detailed attendance for a single student
exports.getStudentAttendanceDetail = async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await Attendance.find({ studentId }).sort({ date: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
