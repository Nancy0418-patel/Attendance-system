const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Timetable = require('../models/Timetable'); // Adjust path to Timetable model

dotenv.config();
MONGO_URI="mongodb+srv://nanpdu800:DEzRurXexmjpxXj1@cluster0.pzwdvqd.mongodb.net/attendence";

const migrateTimetable = async () => {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ MongoDB connected for timetable migration.');

    try {
        // Correct path if migrateTimetable.js is in backend/scripts/
        const timetablePath = path.join(__dirname, '..', 'timetable.json');
        const timetableData = JSON.parse(fs.readFileSync(timetablePath, 'utf-8'));

        await Timetable.deleteMany({});
        console.log('🧹 Existing timetable data cleared.');

        await Timetable.insertMany(timetableData);
        console.log(`✅ ${timetableData.length} timetable entries inserted successfully.`);
    } catch (error) {
        console.error('❌ Error during timetable migration:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB disconnected.');
    }
};

migrateTimetable(); 