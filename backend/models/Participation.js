// models/Participation.js
const mongoose = require("mongoose");

const participationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  eventName: String,
  date: Date,
  type: String, // seminar, sports, etc.
  remarks: String,
});

module.exports = mongoose.model("Participation", participationSchema);