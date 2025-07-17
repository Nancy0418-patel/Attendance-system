const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Timetable = require('../models/Timetable'); // Adjust path as needed

dotenv.config();

const importTimetableData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Clear existing timetable data
    await Timetable.deleteMany({});
    console.log('Existing timetable data cleared.');

    // Read timetable data from JSON file
    const timetableDataPath = path.join(__dirname, '../timetable.json');
    const timetableData = JSON.parse(fs.readFileSync(timetableDataPath, 'utf-8'));

    // Insert new timetable data
    await Timetable.insertMany(timetableData);
    console.log('New timetable data imported successfully!');

    process.exit();
  } catch (error) {
    console.error('Error importing timetable data:', error);
    process.exit(1);
  }
};

importTimetableData(); 