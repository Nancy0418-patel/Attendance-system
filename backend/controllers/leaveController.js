const Leave = require("../models/Leave");
// const sendPushNotification = require("../utils/notificationService");
const sendEmail = require("../utils/emailService");
const Student = require("../models/Student");

exports.applyLeave = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: "Forbidden: Only students can apply for leave." });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: "Student profile not found for this user." });
    }

    const { reason, startDate, endDate } = req.body;

    const leave = new Leave({ studentId: student._id, reason, startDate, endDate });
    const saved = await leave.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getStudentLeaves = async (req, res) => {
  try {
    const { studentId } = req.params;
    const leaves = await Leave.find({ studentId });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    console.log('=== Leave Status Update Started ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Teacher info:', req.user);

    const { leaveId } = req.params;
    const { status } = req.body;
    const teacher = req.user; // Assuming teacher info is available in req.user

    console.log('Attempting to update leave with ID:', leaveId);
    console.log('New status:', status);

    // Find the leave request and populate student details
    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    ).populate('studentId');

    console.log('Updated leave document:', updatedLeave);

    if (!updatedLeave) {
      console.log('Leave request not found for ID:', leaveId);
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Send notification to student and parent
    const student = updatedLeave.studentId;
    let emailSendSuccess = true;
    let emailErrorMessage = '';

    if (student) {
      const studentEmail = student.email;
      const parentEmail = student.parentContact?.email;
      const studentName = `${student.firstName} ${student.lastName}`;

      console.log('Student details:', {
        name: studentName,
        email: studentEmail,
        parentEmail: parentEmail
      });

      const subject = `Leave Request ${status}: ${updatedLeave.reason}`;
      const text = `Dear ${studentName},

Your leave request for '${updatedLeave.reason}' from ${new Date(updatedLeave.startDate).toDateString()} to ${new Date(updatedLeave.endDate).toDateString()} has been ${status.toLowerCase()} by ${teacher.name} (${teacher.email}).

You can reply to this email to contact the teacher directly.

Regards,
Attendance System`;

      console.log('Email details:', {
        subject,
        textLength: text.length,
        replyTo: teacher.email
      });

      try {
        if (studentEmail) {
          console.log('Attempting to send email to student:', studentEmail);
          await sendEmail({
            to: studentEmail,
            subject,
            text,
            replyTo: teacher.email
          });
          console.log('Email sent to student successfully');
        }
        if (parentEmail) {
          console.log('Attempting to send email to parent:', parentEmail);
          await sendEmail({
            to: parentEmail,
            subject,
            text,
            replyTo: teacher.email
          });
          console.log('Email sent to parent successfully');
        }

        // Send push notification to student
        // if (student.oneSignalPlayerId) {
        //   await sendPushNotification({
        //     title: `Leave ${status}`,
        //     message: `Your leave request for '${updatedLeave.reason}' has been ${status.toLowerCase()}.`,
        //     player_ids: [student.oneSignalPlayerId]
        //   });
        // }

        // Send push notification to parent
        // if (student.parentContact?.oneSignalPlayerId) {
        //   await sendPushNotification({
        //     title: `Student Leave ${status}`,
        //     message: `Your child ${studentName}'s leave request for '${updatedLeave.reason}' has been ${status.toLowerCase()}.`,
        //     player_ids: [student.parentContact.oneSignalPlayerId]
        //   });
        // }

      } catch (emailError) {
        console.error('Error sending email notifications:', emailError);
        emailSendSuccess = false;
        emailErrorMessage = emailError.message;
      }
    } else {
      console.log('No student information found for the leave request');
    }

    // Send push notification to teacher (if teacher's player ID exists)
    // if (teacher.oneSignalPlayerId) {
    //   await sendPushNotification({
    //     title: `Leave ${status}`,
    //     message: `You have ${status.toLowerCase()} a leave request for ${student ? student.firstName + ' ' + student.lastName : 'a student'}.`,
    //     player_ids: [teacher.oneSignalPlayerId]
    //   });
    // }

    console.log('=== Leave Status Update Completed ===');
    res.status(200).json({ updatedLeave, emailSendSuccess, emailErrorMessage });
  } catch (err) {
    console.error('Error in updateLeaveStatus:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllLeaveRequests = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query; // Get filter parameters from query
    const query = {};

    if (status) {
      query.status = status; // Filter by status if provided
    }

    if (startDate) {
      query.startDate = { $gte: new Date(startDate) }; // Filter by start date if provided
    }

    if (endDate) {
      query.endDate = { ...query.endDate, $lte: new Date(endDate) }; // Filter by end date if provided, combine with start date if present
    }

    const leaves = await Leave.find(query).populate('studentId', 'firstName lastName rollNumber attendancePercentage totalClasses classesPresent');
    res.status(200).json(leaves);
  } catch (err) {
    console.error('Error in getAllLeaveRequests:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;

    const deletedLeave = await Leave.findByIdAndDelete(leaveId);

    if (!deletedLeave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (err) {
    console.error('Error in deleteLeave:', err);
    res.status(500).json({ error: err.message });
  }
};
