import { useState, useEffect } from "react";

function TimetableList() {
  const [timetable, setTimetable] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All");

  useEffect(() => {
    fetch("/api/timetable") // Make sure your backend serves this endpoint
      .then(res => res.json())
      .then(data => setTimetable(data));
  }, []);

  const filtered = timetable.filter(entry => 
    (selectedBatch === "All" || entry.batch === selectedBatch || entry.batch === null) &&
    (selectedDay === "All" || entry.day === selectedDay)
  );

  return (
    <div>
      <h2>Weekly Timetable</h2>
      <label>
        Batch:
        <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
          <option value="All">All</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </label>
      <label>
        Day:
        <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
          <option value="All">All</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>
      </label>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Batch</th>
            <th>Subject Code</th>
            <th>Subject Name</th>
            <th>Faculty</th>
            <th>Room</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.day}</td>
              <td>{entry.startTime} - {entry.endTime}</td>
              <td>{entry.batch || "All"}</td>
              <td>{entry.subject}</td>
              <td>{entry.subjectName}</td>
              <td>{entry.faculty.join(", ")}</td>
              <td>{entry.room || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TimetableList;
