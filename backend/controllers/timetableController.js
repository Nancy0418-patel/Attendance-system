const Timetable = require("../models/Timetable");

exports.getTimetableByClassAndDay = async (req, res) => {
    try {
        const { classId, dayOfWeek } = req.params;
        
        const timetableEntries = await Timetable.find({
            className: classId,
            day: dayOfWeek,
        }).sort({ startTime: 1 });

        if (!timetableEntries || timetableEntries.length === 0) {
            return res.status(404).json({ message: "No timetable entries found for this day." });
        }

        res.status(200).json(timetableEntries);
    } catch (error) {
        console.error("Error fetching timetable entries:", error);
        res.status(500).json({ message: "Server error" });
    }
};