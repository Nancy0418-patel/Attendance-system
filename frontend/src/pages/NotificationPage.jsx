// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// export default function AttendancePage() {
//   const [students, setStudents] = useState([]);
//   const [studentId, setStudentId] = useState("");
//   const [records, setRecords] = useState([]);
//   const [percentage, setPercentage] = useState(null);

//   const fetchStudents = async () => {
//     const res = await fetch("http://localhost:5000/api/students");
//     const data = await res.json();
//     setStudents(data);
//   };

//   const fetchAttendance = async () => {
//     if (!studentId) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/attendance/${studentId}`);
//       const data = await res.json();
//       setRecords(data);
//       const total = data.length;
//       const present = data.filter(r => r.status === "Present").length;
//       setPercentage(((present / total) * 100).toFixed(2));
//     } catch (err) {
//       console.error("Failed to fetch attendance", err);
//     }
//   };

//   const markCurrentAttendance = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/timetable/current/${studentId}`);
//       const data = await res.json();
//       if (!data.currentClass) return alert("No class running now.");

//       await fetch("http://localhost:5000/api/attendance", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           studentId,
//           classId: data.currentClass._id,
//           status: "Present"
//         })
//       });
//       fetchAttendance();
//     } catch (err) {
//       alert("Error marking attendance.");
//     }
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Attendance Report", 14, 10);
//     doc.autoTable({
//       head: [["Subject", "Status", "Date"]],
//       body: records.map(r => [r.classId?.subject || "-", r.status, new Date(r.createdAt).toLocaleDateString()])
//     });
//     doc.save("attendance_report.pdf");
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     fetchAttendance();
//   }, [studentId]);

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-xl font-bold mb-4 text-blue-700">✅ Attendance Tracker</h2>

//       <select
//         value={studentId}
//         onChange={(e) => setStudentId(e.target.value)}
//         className="mb-4 p-2 border rounded"
//       >
//         <option value="">Select Student</option>
//         {students.map((s) => (
//           <option key={s._id} value={s._id}>
//             {s.name} ({s.rollNumber})
//           </option>
//         ))}
//       </select>

//       {studentId && (
//         <>
//           <div className="flex gap-2 mb-4">
//             <Button onClick={markCurrentAttendance}>Mark Me Present (Current Lecture)</Button>
//             <Button onClick={exportPDF} variant="outline">Export to PDF</Button>
//           </div>

//           <p className="text-blue-600 font-semibold mb-2">Attendance: {percentage}%</p>

//           <div className="grid gap-4">
//             {records.map((r, i) => (
//               <Card key={i} className="border">
//                 <CardContent className="p-4">
//                   <p><strong>Status:</strong> {r.status}</p>
//                   <p><strong>Date:</strong> {new Date(r.createdAt).toLocaleString()}</p>
//                   <p><strong>Subject:</strong> {r.classId?.subject || "N/A"}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
