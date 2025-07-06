import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EmojiEvents as EmojiEventsIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';

const StudentDashboardPage = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [dailyTimetable, setDailyTimetable] = useState([]);
  const [todaysAttendanceRecords, setTodaysAttendanceRecords] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      console.log('Attempting to fetch student data for dashboard...');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://attendence-system-backend.onrender.com/api/students/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errorMessage = 'Failed to fetch student data';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            // If response is not JSON, use status text
            errorMessage = response.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const studentProfileData = await response.json();

        setStudentData(studentProfileData);

        // Fetch daily timetable and attendance
        if (studentProfileData.classId && studentProfileData.classId.className) {
          const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
          
          // Fetch timetable entries
          const timetableResponse = await fetch(`https://attendence-system-backend.onrender.com/api/timetable/${encodeURIComponent(studentProfileData.classId.className)}/${dayOfWeek}`);
          
          if (!timetableResponse.ok) {
            // If timetable not found (e.g., no classes on Saturday), set empty array, don't throw global error
            if (timetableResponse.status === 404) {
              console.warn(`No timetable entries found for ${dayOfWeek}.`);
              setDailyTimetable([]);
            } else {
              let errorMessage = 'Failed to fetch timetable';
              try {
                const timetableData = await timetableResponse.json();
                errorMessage = timetableData.message || errorMessage;
              } catch (jsonError) {
                errorMessage = timetableResponse.statusText || errorMessage;
              }
              throw new Error(errorMessage);
            }
          } else {
            const timetableData = await timetableResponse.json();
            // Filter timetable entries by batch
            const filteredTimetable = timetableData.filter(entry => 
              entry.batch === studentProfileData.batch || entry.batch === null
            );
            setDailyTimetable(filteredTimetable);
          }

          // Fetch attendance records for the student for today
          const attendanceResponse = await fetch(`https://attendence-system-backend.onrender.com/api/attendance/${studentProfileData.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!attendanceResponse.ok) {
            // If no attendance records found for today, set empty array, don't throw global error
            if (attendanceResponse.status === 404) {
                console.warn(`No attendance records found for today for student ${studentProfileData.userId}.`);
                setTodaysAttendanceRecords([]);
            } else {
                let errorMessage = 'Failed to fetch attendance records';
                try {
                  const attendanceRecordsData = await attendanceResponse.json();
                  errorMessage = attendanceRecordsData.message || errorMessage;
                } catch (jsonError) {
                  errorMessage = attendanceResponse.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }
          } else {
            const attendanceRecordsData = await attendanceResponse.json();
            // Filter attendance records for today
            const today = new Date();
            const todaysDateString = today.toISOString().split('T')[0];
            const filteredTodaysAttendance = attendanceRecordsData.filter(record => {
              const recordDateString = new Date(record.date).toISOString().split('T')[0];
              return recordDateString === todaysDateString;
            });
            setTodaysAttendanceRecords(filteredTodaysAttendance);
          }

        }
      } catch (err) {
        console.error('Error fetching data for dashboard:', err);
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, dateOptions));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!studentData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No student data available.</Typography>
      </Box>
    );
  }

  const { firstName, lastName, totalClasses, classesPresent, attendancePercentage, participationScore } = studentData;
  const absentDays = totalClasses - classesPresent;

  // Combine timetable and attendance for display
  const combinedDailyData = dailyTimetable.map(lecture => {
    const attendanceRecord = todaysAttendanceRecords.find(record => 
      record.subject === lecture.subject && 
      record.timeSlot === `${lecture.startTime}-${lecture.endTime}`
    );
    return {
      ...lecture,
      status: attendanceRecord ? attendanceRecord.status : 'N/A',
    };
  });

  // Dummy data for attendance trend, replace with actual data fetching later
  const attendanceTrendData = [
    { name: 'Day 1', percentage: 70 },
    { name: 'Day 2', percentage: 72 },
    { name: 'Day 3', percentage: 75 },
    { name: 'Day 4', percentage: 73 },
    { name: 'Day 5', percentage: 78 },
    { name: 'Day 6', percentage: 80 },
    { name: 'Day 7', percentage: 82 },
  ];

  const getAttendanceChange = () => {
    // This is a placeholder for actual comparison with last month's data
    // For now, it will just show a dummy 2.5% increase.
    const change = 2.5;
    return (
      <Box display="flex" alignItems="center" color="success.main" sx={{ fontSize: '0.875rem' }}>
        <ArrowUpwardIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> {change}% from last month
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Attendance Growth
          </Typography>
          <Typography variant="h6" component="h2" color="text.secondary">
            Welcome back, {firstName} {lastName}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="body1" color="text.secondary">Today</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{currentDate}</Typography>
        </Box>
      </Box>

      <Grid container spacing={3} mb={4}>
        {/* Overall Attendance Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: '12px', textAlign: 'center', p: 2, height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', minHeight: 140 }}>
              <Typography variant="subtitle1" color="text.secondary">Overall Attendance</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4285F4', my: 1 }}>
                {attendancePercentage.toFixed(0)}%
              </Typography>
              {getAttendanceChange()}
            </CardContent>
          </Card>
        </Grid>

        {/* Present Days Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: '12px', textAlign: 'center', p: 2, height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', minHeight: 140 }}>
              <Typography variant="subtitle1" color="text.secondary">Present Days</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50', my: 1 }}>
                {classesPresent}
              </Typography>
              <CheckCircleIcon sx={{ fontSize: '2rem', color: '#4CAF50' }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Absent Days Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: '12px', textAlign: 'center', p: 2, height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', minHeight: 140 }}>
              <Typography variant="subtitle1" color="text.secondary">Absent Days</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F44336', my: 1 }}>
                {absentDays}
              </Typography>
              <CancelIcon sx={{ fontSize: '2rem', color: '#F44336' }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Participation Score Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: '12px', textAlign: 'center', p: 2, height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', minHeight: 140 }}>
              <Typography variant="subtitle1" color="text.secondary">Participation Score</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0', my: 1 }}>
                {participationScore}
              </Typography>
              <EmojiEventsIcon sx={{ fontSize: '2rem', color: '#9C27B0' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Daily Attendance and Timetable Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', mt: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Today's Timetable and Attendance
        </Typography>
        {combinedDailyData.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Faculty</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combinedDailyData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.startTime} - {entry.endTime}</TableCell>
                    <TableCell>{entry.subjectName}</TableCell>
                    <TableCell>{Array.isArray(entry.faculty) ? entry.faculty.join(', ') : entry.faculty}</TableCell>
                    <TableCell>{entry.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No timetable entries or attendance records found for today.</Typography>
        )}
      </Paper>

      {/* Attendance Trend Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', mt: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Attendance Trend (Last 7 Days)
        </Typography>
        <Box sx={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={attendanceTrendData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="percentage" stroke="#4285F4" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentDashboardPage; 