// // frontend/src/pages/StudentPage.jsx


// import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function StudentPage() {
//   const [students, setStudents] = useState([]);
//   const [studentId, setStudentId] = useState(""); // <-- Add this line
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     batch: "A",
//   });

//   // 🔄 Fetch students from backend
//   const fetchStudents = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/students");
//       const data = await res.json();
//       setStudents(data);
//     } catch (err) {
//       console.error("Failed to fetch students", err);
//     }
//   };

//   // ✅ Initial load
//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   // ✍ Handle input
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ➕ Add new student
//   const handleSubmit = async () => {
//     try {
//       await fetch("http://localhost:5000/api/students", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       setForm({ name: "", email: "", phone: "", batch: "A" });
//       fetchStudents();
//     } catch (err) {
//       alert("Failed to add student.");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-xl font-bold mb-4 text-blue-700">👨‍🎓 Add New Student</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <Input name="name" value={form.name} onChange={handleChange} placeholder="Student Name" />
//         <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
//         <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
//         <Input name="batch" value={form.batch} onChange={handleChange} placeholder="Batch (A/B/C/D)" />
//         <div className="col-span-2 text-right">
//           <Button onClick={handleSubmit}>Add Student</Button>
//         </div>
//       </div>

//       {/* Student Selector Dropdown */}
//       <select
//         onChange={(e) => setStudentId(e.target.value)}
//         className="mb-4 border rounded px-2 py-1"
//         value={studentId}
//       >
//         <option value="">Select Student</option>
//         {students.map(s => (
//           <option key={s._id} value={s._id}>
//             {s.name} ({s.rollNumber})
//           </option>
//         ))}
//       </select>

//       <h3 className="text-lg font-bold mb-2 text-blue-600">📋 Registered Students</h3>
//       <div className="grid md:grid-cols-2 gap-4">
//         {students.map((s, i) => (
//           <Card key={i} className="shadow-md border border-blue-200">
//             <CardContent className="p-4">
//               <p><strong>Name:</strong> {s.name}</p>
//               <p><strong>Email:</strong> {s.email}</p>
//               <p><strong>Phone:</strong> {s.phone}</p>
//               <p><strong>Batch:</strong> {s.batch}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }