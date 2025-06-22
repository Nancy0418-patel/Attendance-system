const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  className: { type: String, required: true },         // e.g., "IT"
  batch: { type: String, default: null },              // "A", "B", "C", "D", or null for full class
  day: { type: String, required: true },               // e.g., "Monday"
  subject: { type: String, required: true },           // Subject Code (e.g., IT265)
  subjectName: { type: String, required: true },       // Full Subject Name
  faculty: [{ type: String, required: true }],         // Array of faculty names
  startTime: { type: String, required: true },         // e.g., "09:10"
  endTime: { type: String, required: true }            // e.g., "10:10"
});

module.exports = mongoose.model("Timetable", timetableSchema);
