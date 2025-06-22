const Notification = require("../models/Notification");
const Student = require("../models/Student");
const User = require("../models/User"); // For Teachers and Admins
const sendEmail = require("../utils/emailService");

exports.getNotificationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error fetching notifications" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ success: false, message: "Server error deleting notification" });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    console.log("sendNotification: Request body received:", req.body);
    const { title, message, type, target, userIds } = req.body;

    console.log("Target:", target);

    let targetUsers = [];
    if (target === 'all') {
      const students = await Student.find({});
      const teachers = await User.find({ role: 'teacher' });
      const admins = await User.find({ role: 'admin' });
      targetUsers = [...students, ...teachers, ...admins];
      console.log("sendNotification: Target 'all', fetched users:", targetUsers.length);
    } else if (target === 'students') {
      targetUsers = await Student.find({});
      console.log("sendNotification: Target 'students', fetched students:", targetUsers.length);
    } else if (target === 'teachers') {
      targetUsers = await User.find({ role: 'teacher' });
      console.log("sendNotification: Target 'teachers', fetched teachers:", targetUsers.length);
    } else if (target === 'parents') {
      const studentsWithParents = await Student.find({ 'parentContact.email': { $exists: true, $ne: null } });
      targetUsers = studentsWithParents.map(student => ({ email: student.parentContact.email, name: student.parentContact.name || student.firstName + "'s Parent" }));
      console.log("sendNotification: Target 'parents', fetched parent contacts:", targetUsers.length);
    } else if (target === 'specific_users' && userIds && userIds.length > 0) {
      const studentUsers = await Student.find({ _id: { $in: userIds } });
      const generalUsers = await User.find({ _id: { $in: userIds } });
      targetUsers = [...studentUsers, ...generalUsers];
      console.log("sendNotification: Target 'specific_users', fetched users:", targetUsers.length);
    }

    console.log("Target Users:", targetUsers.map(u => ({ id: u._id, email: u.email, role: u.role })));

    console.log("sendNotification: Before filtering for email recipients. Total targetUsers:", targetUsers.length);
    const emailRecipients = targetUsers
      .filter(user => user.email)
      .map(user => user.email);
    console.log("Email Recipients:", emailRecipients);

    let emailSendSuccess = false;
    if (emailRecipients.length > 0) {
      console.log("sendNotification: Attempting to send email.");
      try {
        await sendEmail({
          to: emailRecipients.join(','),
          subject: title,
          text: message,
        });
        emailSendSuccess = true;
        console.log("sendNotification: Email sent successfully.");
      } catch (emailError) {
        console.error("sendNotification: Error sending email notification:", emailError);
        // Continue even if email fails
      }
    }

    console.log("sendNotification: Email send success status:", emailSendSuccess);

    // Save notification to DB for each target user if not a generic target like 'all' or 'parents'
    if (target !== 'all' && target !== 'parents') {
      console.log("sendNotification: Saving individual notifications to DB.");
      for (const user of targetUsers) {
        if (!user._id) {
          console.error("Missing _id for user:", user);
          continue;
        }

        const existingNotification = await Notification.findOne({
          userId: user._id,
          title,
          message,
          createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
        });

        if (!existingNotification) {
          console.log(`Creating notification for user: ${user._id}`);
          await Notification.create({
            userId: user._id,
            title,
            message,
            type,
            target: user.role || 'student',
          });
          console.log(`sendNotification: Saved notification for user ID: ${user._id}`);
        }
      }
    } else if (target === 'all') {
      console.log("sendNotification: Target is 'all', relying on email for notification. Not saving individual in-app notifications.");
    }

    res.status(200).json({ success: true, message: "Notification sent successfully!", emailSendSuccess });
  } catch (error) {
    console.error("sendNotification: Fatal error in sendNotification:", error);
    res.status(500).json({ success: false, message: "Server error sending notification" });
  }
}; 