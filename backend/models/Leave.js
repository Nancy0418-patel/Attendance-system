// models/Leave.js
const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  startDate: Date,
  endDate: Date,
  reason: String,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  remarks: String,
});

module.exports = mongoose.model("Leave", leaveSchema);
