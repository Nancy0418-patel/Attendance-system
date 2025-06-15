
const nodemailer = require("nodemailer");
const Student = require("../models/Student"); // Import Student model

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nanpdu800@gmail.com",
    pass: "afcxfmlvuywwxszk",  // App password from Gmail (spaces removed)
  },
});

const sendEmail = async ({ to, subject, text, replyTo }) => {
  try {
    if (!to || !subject || !text) {
      throw new Error('Missing required email fields: to, subject, or text');
    }
    
    const info = await transporter.sendMail({
      from: `"Attendance System" <nanpdu800@gmail.com>`,
      to,
      subject,
      text,
      replyTo: replyTo || undefined
    });
    console.log("✅ Email sent to:", to);
    console.log("✅ Message ID:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email to:", to);
    console.error("❌ Error details:", error.message);
    throw error;
  }
};

const sendTestEmail = async () => {
  try {
    const students = await Student.find({}); // Fetch all students

    if (students.length === 0) {
      console.log("🤷‍♀️ No students found to send test emails to.");
      return;
    }

    for (const student of students) {
      if (student.email) {
        console.log(`Attempting to send test email to ${student.email}...`);
        await sendEmail({
          to: student.email,
          subject: "Test Email from Attendance System (Batch Send)",
          text: `Dear ${student.firstName} ${student.lastName},

This is a test email sent from the backend email service to multiple students.

Regards,
Attendance System Team`,
        });
        console.log(`✅ Test email sent to ${student.email}`);
      } else {
        console.log(`Skipping test email for student ${student.firstName} ${student.lastName}: No email address found.`);
      }
    }
    console.log("✅ All test emails processed.");
  } catch (error) {
    console.error("❌ Error sending test emails to multiple students:", error);
  }
};

// For testing purposes, you can uncomment this line to send a test email when the service is loaded
// sendTestEmail(); 

module.exports = sendEmail;
