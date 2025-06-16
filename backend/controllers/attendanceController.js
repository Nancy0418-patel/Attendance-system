// controllers/attendanceController.js
const axios = require("axios");
const Attendance = require("../models/Attendance");
const sendEmail = require("../utils/emailService");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
// const sendPushNotification = require("../utils/notificationService");

exports.markAttendance = async (req, res) => {
  const { classId, date, attendance, subject, timeSlot } = req.body;

  try {
    const attendanceRecords = [];
    for (const record of attendance) {
      const { studentId, status } = record;

      // Find the student by their ID
      const student = await Student.findById(studentId);
      if (!student) {
        console.warn(`Student with ID ${studentId} not found. Skipping attendance update for this student.`);
        continue; // Skip to the next record
      }

      const newAttendance = new Attendance({
        studentId,
        classId,
        date: new Date(date),
        subject,
        timeSlot,
        status,
      });
      await newAttendance.save();
      attendanceRecords.push(newAttendance);

      // Update student's attendance statistics
      student.totalClasses += 1;
      if (status === "Present") {
        student.classesPresent += 1;
      }
      student.attendancePercentage = (student.classesPresent / student.totalClasses) * 100;
      await student.save();

      // Check if attendance is below 75%
      if (student.attendancePercentage < 75) {
        const studentFullName = `${student.firstName} ${student.lastName}`.trim();
        const attendancePercentage = student.attendancePercentage.toFixed(2);
        const classesNeeded = Math.ceil((0.75 * student.totalClasses - student.classesPresent) / 0.25);

        // Prepare detailed message
        const studentMessage = `Dear ${studentFullName},

Your current attendance percentage is ${attendancePercentage}%, which is below the required minimum of 75%.

Details:
- Total Classes: ${student.totalClasses}
- Classes Present: ${student.classesPresent}
- Current Attendance: ${attendancePercentage}%
- Classes needed to reach 75%: ${classesNeeded}

Please ensure regular attendance to maintain the minimum required percentage.

Best regards,
Attendance System`;

        const parentMessage = `Dear Parent,

This is to inform you that your child ${studentFullName}'s attendance has fallen below the required minimum of 75%.

Current Status:
- Total Classes: ${student.totalClasses}
- Classes Present: ${student.classesPresent}
- Current Attendance: ${attendancePercentage}%
- Classes needed to reach 75%: ${classesNeeded}

Please ensure your child maintains regular attendance.

Best regards,
Attendance System`;

        // Check if a notification was already sent today for this student
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingNotification = await Notification.findOne({
          userId: student._id,
          title: "Low Attendance Warning",
          createdAt: { $gte: today }
        });

        if (!existingNotification) {
        // 📧 Send Email to student
        await sendEmail({
          to: student.email,
            subject: "⚠️ Attendance Alert - Below Required Percentage",
            text: studentMessage
        });

        // 📧 Email to parent (if exists)
        if (student.parentContact?.email) {
          await sendEmail({
            to: student.parentContact.email,
              subject: `⚠️ Attendance Alert for ${studentFullName}`,
              text: parentMessage
          });
        }

        // 🔔 In-App Notification
        await Notification.create({
          userId: student._id,
          title: "Low Attendance Warning",
            message: `Your attendance is ${attendancePercentage}%. You need to attend ${classesNeeded} more classes to reach 75%.`,
            type: "warning"
        });

          // 🔔 Push Notifications
          // if (student.oneSignalPlayerId) {
          //   await sendPushNotification({
          //     title: "⚠️ Low Attendance Alert",
          //     message: `Your attendance is ${attendancePercentage}%. Attend ${classesNeeded} more classes to reach 75%.`,
          //     player_ids: [student.oneSignalPlayerId]
          //   });
          // }

          // if (student.parentContact?.oneSignalPlayerId) {
          //   await sendPushNotification({
          //     title: `⚠️ Attendance Alert for ${studentFullName}`,
          //     message: `Your child's attendance is ${attendancePercentage}%. ${classesNeeded} more classes needed to reach 75%.`,
          //     player_ids: [student.parentContact.oneSignalPlayerId]
          //   });
          // }
        }
      }
    }

    res.status(201).json({ message: "Attendance marked successfully", records: attendanceRecords });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId: userId } = req.params; // This is actually the userId from frontend
    
    // Find the student document using the userId
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ message: "Student profile not found." });
    }

    // Now fetch attendance records using the student's _id
    const records = await Attendance.find({ studentId: student._id }).populate("classId");
    res.status(200).json(records);
  } catch (err) {
    console.error("Error in getAttendanceByStudent:", err);
    res.status(500).json({ error: err.message });
  }
};