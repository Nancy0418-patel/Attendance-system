const express = require("express");
const router = express.Router();
const { getNotificationsForUser, deleteNotification, sendNotification } = require("../controllers/notificationController");
const protect = require("../middleware/authMiddleware");

// Get notifications for a specific user
router.get("/user/:userId", protect, getNotificationsForUser);

// Delete a notification by ID
router.delete("/:id", protect, deleteNotification);

// Send a new notification (includes push and email)
router.post("/send", protect, sendNotification);

module.exports = router; 