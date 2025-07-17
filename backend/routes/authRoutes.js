// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Student = require("../models/Student");

dotenv.config();

// Helper to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res) => {
  const { email, password, role, firstName, lastName } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      password,
      role,
    });

    if (user) {
      // If the registered user is a student, create a student profile
      if (user.role === 'student') {
        const student = await Student.create({
          userId: user._id,
          email: user.email, // Assuming email is also part of student profile
          // You might want to add more student-specific fields here from req.body if available
          // e.g., firstName: req.body.firstName, lastName: req.body.lastName, rollNumber: req.body.rollNumber
          firstName: firstName,
          lastName: lastName,
          batch: "", // Placeholder
          className: "", // Placeholder
          phone: "", // Placeholder
          rollNumber: `ROLL${Math.floor(Math.random() * 100000)}`, // Simple placeholder for now
          parentContact: { name: "", email: "", phone: "" }, // Placeholder
        });
        console.log('Student profile created:', student);
        console.log('Student profile userId:', student.userId);
      }

      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user's OneSignal player ID
// @route   POST /api/users/update-player-id
// @access  Private (consider adding auth middleware if this endpoint is not open to all)
router.post("/update-player-id", async (req, res) => {
  const { userId, playerId, role } = req.body;

  try {
    if (role === 'student') {
      // Find student by userId (which links to the User model)
      const student = await Student.findOneAndUpdate({ userId: userId }, { oneSignalPlayerId: playerId }, { new: true });
      if (!student) {
        console.log(`Student with userId ${userId} not found when updating player ID.`);
        return res.status(404).json({ message: "Student not found." });
      }
      // If the student has a parent, also update the parent's player ID if applicable
      // This assumes the parent also logs in or has a separate mechanism to get their player ID.
      // For simplicity, we are setting it on student's parentContact for now.
      if (student.parentContact && student.parentContact.email) {
        // You might need a more sophisticated way to get the parent's actual userId if they have a separate login.
        // For now, we'll assume the student's player ID is also associated with the parent's contact for direct messages.
        // If the parent has a separate login, their oneSignalPlayerId would be on their User model.
        // For this scenario, we would need to find the parent User based on student.parentContact.email.
        // For now, we'll assume student and parent share the same device/notification intent for simplicity.
        // This part needs clarification on how parent accounts are handled for separate logins.
        // For direct student-parent relation, you could update parentContact.oneSignalPlayerId here if applicable.
        // Or, more robustly, if parents have their own User accounts, update their User.oneSignalPlayerId
      }

      res.status(200).json({ message: "Student player ID updated successfully." });
    } else if (role === 'teacher' || role === 'admin') {
      const user = await User.findByIdAndUpdate(userId, { oneSignalPlayerId: playerId }, { new: true });
      if (!user) {
        console.log(`User with userId ${userId} (role: ${role}) not found when updating player ID.`);
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({ message: "User player ID updated successfully." });
    } else {
      return res.status(400).json({ message: "Invalid role provided." });
    }
  } catch (error) {
    console.error("Error updating player ID:", error);
    res.status(500).json({ message: "Server error while updating player ID." });
  }
});

module.exports = router;