const Teacher = require("../models/Teacher");

exports.addTeacher = async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    const saved = await newTeacher.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
