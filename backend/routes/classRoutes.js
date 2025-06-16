// backend/routes/classRoutes.js

const express = require("express");
const router = express.Router();
const { createClass, getAllClasses } = require("../controllers/classController");
const Student = require("../models/Student");
const Class = require("../models/Class");

router.post("/", createClass);
router.get("/", async (req, res) => {
    try {
        const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  });

// GET /api/classes/:classId/students
router.get("/:classId", async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:classId/students", async (req, res) => {
  try {
    const { classId } = req.params;
    const { batch } = req.query; // Get batch from query parameters
    
    let query = { classId };

    // If batch is explicitly 'null' string or empty string, do NOT filter by batch.
    // Otherwise, apply the batch filter if a specific batch value is provided.
    if (batch !== undefined && batch !== 'null' && batch !== '') { 
      query.batch = batch;
    }

    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
