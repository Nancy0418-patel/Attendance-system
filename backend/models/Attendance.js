// models/Attendance.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  date: { type: Date, required: true },
  subject: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true },
  remarks: String,
});

module.exports = mongoose.model("Attendance", attendanceSchema);
