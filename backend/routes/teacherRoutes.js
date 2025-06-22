// backend/routes/teacherRoutes.js

const express = require("express");
const router = express.Router();
const { addTeacher, getAllTeachers } = require("../controllers/teacherController");

router.post("/", addTeacher);
router.get("/", getAllTeachers);

module.exports = router;
