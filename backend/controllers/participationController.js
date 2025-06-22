const Participation = require("../models/Participation");
// const sendPushNotification = require("../utils/notificationService");
const sendEmail = require("../utils/emailService");
const Student = require("../models/Student");

exports.addParticipation = async (req, res) => {
  try {
    console.log('addParticipation: Request body:', req.body);
    console.log('addParticipation: Authenticated user:', req.user);

    const { activity, date } = req.body;

    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: "Forbidden: Only students can add participation." });
    }

    // Find the student associated with the authenticated user
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: "Student profile not found for this user." });
    }

    const studentId = student._id; // Use the student's _id

    const participation = new Participation({ studentId, eventName: activity, date });
    await participation.save();

    // Send push notification to student
    // if (student.oneSignalPlayerId) {
    //   await sendPushNotification({
    //     title: "Participation Recorded",
    //     message: `Your participation in '${activity}' on ${new Date(date).toDateString()} has been recorded.`,
    //     player_ids: [student.oneSignalPlayerId]
    //   });
    // }

    // Send push notification to parent
    // if (student.parentContact?.oneSignalPlayerId) {
    //   await sendPushNotification({
    //     title: "Student Participation Recorded",
    //     message: `Your child ${student.firstName} ${student.lastName}'s participation in '${activity}' on ${new Date(date).toDateString()} has been recorded.`,
    //     player_ids: [student.parentContact.oneSignalPlayerId]
    //   });
    // }

    res.status(201).json({ success: true, participation });
  } catch (err) {
    console.error('addParticipation: Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getParticipationByStudent = async (req, res) => {
  try {
    console.log('getParticipationByStudent: Request params:', req.params);
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    const records = await Participation.find({ studentId });
    console.log('getParticipationByStudent: Records found:', records);
    res.status(200).json(records);
  } catch (err) {
    console.error('getParticipationByStudent: Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllParticipationActivities = async (req, res) => {
  try {
    const activities = await Participation.find({}).populate('studentId', 'firstName lastName'); // Populate student details
    res.status(200).json(activities);
  } catch (err) {
    console.error('getAllParticipationActivities: Error:', err);
    res.status(500).json({ error: err.message });
  }
};
