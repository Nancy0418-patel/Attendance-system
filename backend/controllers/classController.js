const Class = require("../models/Class");

exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const saved = await newClass.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("teacherId");
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
