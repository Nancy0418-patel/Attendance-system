import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import LeaveApprovalPage from './pages/LeaveApprovalPage';
import ParticipationPage from './pages/ParticipationPage';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboardPage from './pages/StudentDashboardPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import TimetableManagementPage from './pages/TimetableManagementPage';
import AttendancePage from './pages/AttendancePage';
import StudentProfilePage from './pages/StudentProfilePage';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OneSignal from 'react-onesignal';
import AttendanceAnalysis from './pages/AttendanceAnalysis';
function App() {
  useEffect(() => {
    OneSignal.init({
      appId: "93d8ad7c-13ee-4c91-aa2c-fa97fc2e3c10",
      safari_web_id: 'web.onesignal.auto.11d73507-28d1-4034-8c44-59e691234b6b',
      allowLocalhostAsSecureOrigin: true,
      autoResubscribe: true,
    }).then(() => {
      console.log('OneSignal initialized.');
      OneSignal.getUserId().then(playerId => {
        console.log("OneSignal.getUserId() returned:", playerId);
        if (playerId) {
          console.log("OneSignal Player ID from SDK (valid):", playerId);
          sendPlayerIdToBackend(playerId);
        } else {
          console.log("No OneSignal Player ID available yet (null/undefined). Prompting...");
          OneSignal.showNativePrompt();
        }
      });
    }).catch(error => {
      console.error("Error initializing OneSignal:", error);
    });
  }, []);

  const sendPlayerIdToBackend = async (playerId) => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    console.log('Inside sendPlayerIdToBackend. Received:', { playerId, userId, role });

    if (!userId || !token) {
      console.warn('Cannot send player ID to backend: User ID or token missing.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/update-player-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, playerId, role }),
      });

      if (response.ok) {
        console.log('Player ID sent to backend successfully!');
      } else {
        const data = await response.json();
        console.error('Failed to send player ID to backend:', data.message || response.statusText);
      }
    } catch (error) {
      console.error('Error sending player ID to backend:', error);
    }
  };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/teacher" element={<PrivateRoute requiredRole="teacher" />}>
          <Route path="dashboard" element={<Layout><TeacherDashboardPage /></Layout>} />
          <Route path="students" element={<Layout><Students /></Layout>} />
          <Route path="attendance" element={<Layout><Attendance /></Layout>} />
          <Route path="leave-approval" element={<Layout><LeaveApprovalPage /></Layout>} />
          <Route path="participation" element={<Layout><ParticipationPage /></Layout>} />
          <Route path="notifications" element={<Layout><Notifications /></Layout>} />
          <Route path="timetable" element={<Layout><TimetableManagementPage /></Layout>} />
          <Route path="attendance-analysis" element={<AttendanceAnalysis />} />
        </Route>

        <Route path="/student" element={<PrivateRoute requiredRole="student" />}>
          <Route path="dashboard" element={<Layout><StudentDashboardPage /></Layout>} />
          <Route path="attendance" element={<Layout><AttendancePage /></Layout>} />
          <Route path="profile" element={<Layout><StudentProfilePage /></Layout>} />
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App; 
