// controllers/studentController.js
const Student = require("../models/Student");
const User = require("../models/User"); // Import User model
const bcrypt = require("bcryptjs"); // Import bcryptjs

exports.addStudent = async (req, res) => {
  try {
    const { email, firstName, lastName, ...otherStudentData } = req.body;

    // 1. Check if a user with this email already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, but doesn't have a student profile yet, link it
      // Or if the student already has a userId, prevent creating another user
      const existingStudent = await Student.findOne({ userId: user._id });
      if (existingStudent) {
        return res.status(400).json({ message: "Student with this email already exists and is linked to a user account." });
      }
      // If user exists but no student profile, proceed to link below
    } else {
      // 2. If no user exists, create a new user account for the student
      const defaultPassword = "password123"; // A default password for newly added students
      const hashedPassword = await bcrypt.hash(defaultPassword, 10); // Hash the password

      user = await User.create({
        email,
        password: hashedPassword,
        role: "student",
      });
      console.log(`New user created for student: ${email} with temporary password: ${defaultPassword}`);
    }

    // 3. Create the student profile and link it to the user account
    const newStudent = new Student({
      email,
      firstName,
      lastName,
      userId: user._id, // Link student to the newly created or existing user
      ...otherStudentData,
    });
    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent);
  } catch (err) {
    // Check if the error is a duplicate key error (for unique fields like email in User model)
    if (err.code === 11000) {
      return res.status(400).json({ message: "A user with this email already exists." });
    }
    console.error("Error adding student:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("classId");
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentProfile = async (req, res) => {
  console.log("Backend: getStudentProfile called.");
  console.log("Backend: User ID from token (req.user.id):", req.user ? req.user.id : "undefined/null");

  try {
    // The student ID is available from the auth middleware (req.user.id)
    const student = await Student.findOne({ userId: req.user.id }).populate('classId');
    
    console.log("Backend: Student found for userId:", req.user.id, ", Student data:", student);

    if (!student) {
      console.log("Backend: Student profile not found for userId:", req.user.id);
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    res.status(200).json(student);
    console.log("Backend: Student profile sent.");
  } catch (err) {
    console.error("Backend: Error in getStudentProfile:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, ...updateData } = req.body; // Destructure email if it's sent in update
    
    // If email is being updated, handle the user model as well
    if (email) {
      const studentToUpdate = await Student.findById(id);
      if (studentToUpdate && studentToUpdate.userId) {
        await User.findByIdAndUpdate(studentToUpdate.userId, { email });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Also delete the associated user account if it exists
    if (student.userId) {
      await User.findByIdAndDelete(student.userId);
      console.log(`Associated user ${student.userId} deleted.`);
    }

    res.status(200).json({ message: "Student and associated user removed" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: err.message });
  }
};
