const mongoose = require('mongoose');
const Leave = require('../models/Leave');

// Direct MongoDB connection string
const MONGODB_URI = "mongodb+srv://nanpdu800:DEzRurXexmjpxXj1@cluster0.pzwdvqd.mongodb.net/attendence";

async function updateLeaveDates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all leave requests without dates
    const leaves = await Leave.find({
      $or: [
        { startDate: { $exists: false } },
        { endDate: { $exists: false } },
        { startDate: null },
        { endDate: null }
      ]
    });

    console.log(`Found ${leaves.length} leave requests without dates`);

    // Update each leave request with default dates
    for (const leave of leaves) {
      // Set default dates (you can modify these as needed)
      const defaultStartDate = new Date(); // Today
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 1); // Tomorrow

      // Update the leave request
      await Leave.findByIdAndUpdate(leave._id, {
        startDate: defaultStartDate,
        endDate: defaultEndDate
      });

      console.log(`Updated leave request ${leave._id}`);
    }

    console.log('All leave requests have been updated');
  } catch (error) {
    console.error('Error updating leave dates:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the update function
updateLeaveDates(); 