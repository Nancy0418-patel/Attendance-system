// models/Class.js
const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  classDays: [{ type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] }],
  startTime: String,
  endTime: String,
});

module.exports = mongoose.model("Class", classSchema);
