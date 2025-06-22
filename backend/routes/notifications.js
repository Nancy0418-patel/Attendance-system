//routes/notification.js

const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
// const sendPushNotification = require("../utils/notificationService"); // This line will be completely removed
const Student = require("../models/Student");
const User = require("../models/User");
const mongoose = require('mongoose'); // Import mongoose

// Create a notification
router.post("/send", async (req, res) => {
  try {
    const { userId, title, message } = req.body;

    const newNotification = new Notification({ userId, title, message });
    await newNotification.save();

    res.status(201).json({ success: true, notification: newNotification });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🚀 Send targeted push notification (for teachers/admins)
// router.post("/push", async (req, res) => {
//   const { title, message, target, ids } = req.body;

//   let player_ids = [];
//   try {
//     if (target === 'all') {
//       // sendPushNotification will handle 'All' segment if player_ids is empty
//     } else if (target === 'students') {
//       const students = await Student.find({ oneSignalPlayerId: { $ne: null } });
//       player_ids = students.map(s => s.oneSignalPlayerId);
//     } else if (target === 'parents') {
//       const studentsWithParents = await Student.find({ "parentContact.oneSignalPlayerId": { $ne: null } });
//       player_ids = studentsWithParents.map(s => s.parentContact.oneSignalPlayerId);
//     } else if (target === 'specific_users' && ids && ids.length > 0) {
//       const objectIdIds = [];
//       const rollNumberIds = [];

//       ids.forEach(id => {
//         if (mongoose.Types.ObjectId.isValid(id)) {
//           objectIdIds.push(id);
//         } else {
//           rollNumberIds.push(id);
//         }
//       });

//       const users = await User.find({ _id: { $in: objectIdIds }, oneSignalPlayerId: { $ne: null } });
//       const students = await Student.find({ rollNumber: { $in: rollNumberIds }, oneSignalPlayerId: { $ne: null } });
      
//       player_ids = [...users.map(u => u.oneSignalPlayerId), ...students.map(s => s.oneSignalPlayerId)];
//     } else {
//       return res.status(400).json({ success: false, message: "Invalid target or missing IDs" });
//     }

//     // Only send if there are specific player_ids or if target is 'all'
//     if (player_ids.length > 0 || target === 'all') {
//       await sendPushNotification({ title, message, player_ids });
//       res.json({ success: true, message: "Push notification sent." });
//     } else {
//       res.status(200).json({ success: false, message: "No target devices found for notification." });
//     }

//   } catch (error) {
//     console.error("Error in /api/notifications/push:", error);
//     res.status(500).json({ success: false, message: "Push failed", error: error.message });
//   }
// });

module.exports = router;
