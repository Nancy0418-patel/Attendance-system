// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const { addStudent, getAllStudents, getStudentProfile, updateStudent, deleteStudent } = require("../controllers/studentController");
const auth = require("../middleware/authMiddleware");
const Student = require("../models/Student");

router.post("/", addStudent);       // Add a new student
router.get("/", getAllStudents);    // Get all students
router.put("/:id", updateStudent); // Update a student by ID
router.delete("/:id", deleteStudent); // Delete a student by ID
router.get("/profile", auth, getStudentProfile);      // ✅ /api/students/profile
router.get('/:id', getStudentById);
// router.get("/profile", auth, async (req, res) => {
//     try {
//       // Find student using the user ID or email from the token
//       const student = await Student.findOne({ userId: req.user.id }); // change as needed
  
//       if (!student) {
//         return res.status(404).json({ error: "Student profile not found" });
//       }
  
//       res.json(student);
//     } catch (err) {
//       res.status(500).json({ error: "Server error" });
//     }
//   });
module.exports = router;
