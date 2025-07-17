const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('../models/Student');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Timetable = require('./models/Timetable'); // Adjust path if needed
const fs = require('fs');
const path = require('path');
dotenv.config();

const migrateStudents = async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected for migration.');

    try {
        const students = await Student.find({});
        let migratedCount = 0;

        for (const student of students) {
            if (!student.userId) { // Only process students that are not yet linked to a user
                let user = await User.findOne({ email: student.email });

                if (!user) {
                    // Create a new user if one doesn't exist for this student's email
                    const defaultPassword = 'password123'; // Default password for migrated students
                    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

                    user = await User.create({
                        email: student.email,
                        password: hashedPassword,
                        role: 'student'
                    });
                    console.log(`Created new user for student ${student.email} with ID: ${user._id} and default password: ${defaultPassword}`);
                } else {
                    console.log(`User already exists for student ${student.email} with ID: ${user._id}`);
                }

                // Ensure required fields for Student model are present before saving
                if (!student.firstName) {
                    student.firstName = 'Unknown';
                    console.warn(`Warning: Student ${student.email} missing firstName. Set to 'Unknown'.`);
                }
                if (!student.lastName) {
                    student.lastName = 'Unknown';
                    console.warn(`Warning: Student ${student.email} missing lastName. Set to 'Unknown'.`);
                }

                // Link the student to the user
                student.userId = user._id;
                await student.save();
                migratedCount++;
                console.log(`Linked student ${student.email} to user ID: ${user._id}`);
            }
        }

        console.log(`Migration complete! ${migratedCount} students were migrated/linked.`);
    } catch (error) {
        console.error('Error during student migration:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

migrateStudents(); 