// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNumber: { type: String, unique: true }, // Student ID is now rollNumber
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  phone: { type: String },
  address: { type: String }, // Single address field, can be expanded to nested if needed
  permanentAddress: {
    village: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  localAddress: {
    village: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  enrollmentDate: { type: Date, default: Date.now },
  totalClasses: { type: Number, default: 0 },
  classesPresent: { type: Number, default: 0 },
  attendancePercentage: { type: Number, default: 0 },
  participationScore: { type: Number, default: 0 },
  batch:String,
  className: String,
  oneSignalPlayerId: String, // Removed as push notifications are no longer used
  parentContact: {
    name: String,
    email: String,
    phone: String,
    // oneSignalPlayerId: String, // Removed as push notifications are no longer used
  },
});

module.exports = mongoose.model("Student", studentSchema);
