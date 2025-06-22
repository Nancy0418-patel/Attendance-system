// // frontend/main.jsx


// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import StudentPage from "./src/pages/StudentPage";
// import TimetablePage from "./src/pages/TimetablePage";
// import AttendancePage from "./src/pages/AttendancePage";
// import NotificationsPage from "./src/pages/NotificationsPage";
// import ParticipationPage from "./src/pages/ParticipationPage";
// import LeavePage from "./src/pages/LeavePage";
// import { Button } from "@/components/ui/button";

// export default function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
//         <nav className="flex justify-between items-center bg-white shadow-md rounded-xl p-4 mb-6">
//           <h1 className="text-2xl font-bold text-blue-700">🎓 IT Student Portal</h1>
//           <div className="space-x-2">
//             <Link to="/"><Button>Student</Button></Link>
//             <Link to="/timetable"><Button>Timetable</Button></Link>
//             <Link to="/attendance"><Button>Attendance</Button></Link>
//             <Link to="/notifications"><Button>Notifications</Button></Link>
//             <Link to="/participation"><Button>Participation</Button></Link>
//             <Link to="/leave"><Button>Leave</Button></Link>
//           </div>
//         </nav>

//         <Routes>
//           <Route path="/" element={<StudentPage />} />
//           <Route path="/timetable" element={<TimetablePage />} />
//           <Route path="/attendance" element={<AttendancePage />} />
//           <Route path="/notifications" element={<NotificationsPage />} />
//           <Route path="/participation" element={<ParticipationPage />} />
//           <Route path="/leave" element={<LeavePage />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }
