// frontend/src/pages/TimetablePage.jsx


import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import API_BASE_URL from '../utils/api';

export default function TimetablePage() {
  const [timetable, setTimetable] = useState([]);
  const [day, setDay] = useState("Monday");

  const fetchTimetable = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/timetable?day=${day}`);
      const data = await res.json();
      setTimetable(data);
    } catch (error) {
      console.error("Error fetching timetable", error);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [day]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-700">📅 Weekly Timetable</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
          <Button key={d} onClick={() => setDay(d)} variant={d === day ? "default" : "outline"}>
            {d}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {timetable.length === 0 ? (
          <p>No classes for {day}.</p>
        ) : (
          timetable.map((item, idx) => (
            <Card key={idx} className="shadow-md border border-blue-200">
              <CardContent className="p-4 space-y-1">
                <p><strong>Subject:</strong> {item.subjectName} ({item.subject})</p>
                <p><strong>Faculty:</strong> {item.faculty?.join(", ")}</p>
                <p><strong>Time:</strong> {item.startTime} - {item.endTime}</p>
                <p><strong>Batch:</strong> {item.batch || "All"}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
