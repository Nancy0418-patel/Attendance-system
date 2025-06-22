// backend/routes/leaveRoutes.js

const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getStudentLeaves,
  updateLeaveStatus,
  getAllLeaveRequests,
  deleteLeave,
} = require("../controllers/leaveController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/", protect, applyLeave); // Apply for leave
router.get("/", getAllLeaveRequests); // New route to get all leave requests
router.get("/:studentId", getStudentLeaves); // Get all leaves of a student
router.put("/:leaveId", protect, authorize(['teacher', 'admin']), updateLeaveStatus); // Approve/reject a leave
router.delete("/:leaveId", protect, authorize(['teacher', 'admin']), deleteLeave); // Delete a leave request

module.exports = router;
