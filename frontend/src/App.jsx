import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Students from './pages/Students';
import AttendanceForTeacher from './pages/Attendance';
import AttendancePage from './pages/AttendancePage';
import Notifications from './pages/Notifications';
import StudentProfilePage from './pages/StudentProfilePage'; // This will be the student's profile page
import ParentDashboardPage from './pages/ParentDashboardPage'; // This will be the parent's dashboard
import LeaveApprovalPage from './pages/LeaveApprovalPage'; // For teachers/admins
import ParticipationPage from './pages/ParticipationPage'; // For students
import LeavePage from './pages/LeavePage'; // For student's leave requests
import EditStudentProfilePage from './pages/EditStudentProfilePage'; // This will be the student's edit profile page
import StudentDashboardPage from './pages/StudentDashboardPage'; // This will be the student's dashboard page
import OneSignalInitializer from './OneSignalInitializer';
import TimetableManagementPage from './pages/TimetableManagementPage';
import Attendance from './pages/Attendance'; // Attendance marking for teachers
import AttendanceAnalysis from './pages/AttendanceAnalysis';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes for students */}
          <Route path="/student" element={<PrivateRoute allowedRoles={['student']}><Layout /></PrivateRoute>}>
            <Route index element={<StudentProfilePage />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="attendance" element={<StudentDashboardPage />} />
            <Route path="leave" element={<LeavePage />} />
            <Route path="participation" element={<ParticipationPage />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="edit-profile" element={<EditStudentProfilePage />} />
          </Route>

          {/* Protected Routes for teachers */}
          <Route path="/teacher" element={<PrivateRoute allowedRoles={['teacher']}><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="timetable-management" element={<TimetableManagementPage />} />
            <Route path="attendance" element={<AttendanceForTeacher />} />
            <Route path="leave-approval" element={<LeaveApprovalPage />} />
            <Route path="students" element={<Students />} />
            <Route path="teacher-dashboard" element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="attendance-analysis" element={<AttendanceAnalysis />} />
          </Route>

          {/* Protected Routes for parents */}
          <Route path="/parent" element={<PrivateRoute allowedRoles={['parent']}><Layout /></PrivateRoute>}>
            <Route index element={<ParentDashboardPage />} />
            <Route path="notifications" element={<Notifications />} />
            {/* Add more parent-specific routes here */}
          </Route>

          {/* Protected Routes for admins */}
          <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="attendance" element={<AttendanceForTeacher />} />
            <Route path="leave-approval" element={<LeaveApprovalPage />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Fallback route if none of the above match (e.g., 404) */}
          <Route path="*" element={<div>Page Not Found or Unauthorized</div>} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <OneSignalInitializer />
    </ThemeProvider>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default App;