const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Timetable = require('./backend/models/Timetable');

dotenv.config();
const MONGO_URI = "mongodb+srv://nanpdu800:DEzRurXexmjpxXj1@cluster0.pzwdvqd.mongodb.net/attendence?retryWrites=true&w=majority&appName=Cluster0";

const checkTimetableCount = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected.');

    const Timetable = mongoose.model("Timetable", new mongoose.Schema({}, { strict: false }));
    const count = await Timetable.countDocuments();
    console.log(`Timetables collection count: ${count}`);

  } catch (error) {
    console.error('Error connecting to MongoDB or fetching timetable count:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

checkTimetableCount(); 