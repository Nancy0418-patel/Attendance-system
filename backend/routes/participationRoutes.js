// routes/Participation
const express = require("express");
const router = express.Router();
const {
  addParticipation,
  getParticipationByStudent,
  getAllParticipationActivities,
} = require("../controllers/participationController");
const Participation = require("../models/Participation");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/", protect, addParticipation); // Add participation
router.get("/:studentId", protect, getParticipationByStudent); // Get student's records
router.get("/", protect, authorize(['teacher', 'admin']), getAllParticipationActivities); // Get all participation records for teachers/admins

module.exports = router;
