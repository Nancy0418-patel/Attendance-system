import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import API_BASE_URL from '../utils/api';

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dailyTimetable, setDailyTimetable] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [totalLectures, setTotalLectures] = useState(0);
  const [presentLectures, setPresentLectures] = useState(0);
  const [absentLectures, setAbsentLectures] = useState(0);
  const [totalAttendancePercentage, setTotalAttendancePercentage] = useState(0);
  const [absentPercentage, setAbsentPercentage] = useState(0);

  useEffect(() => {
    console.log('AttendancePage: useEffect running.');
    const fetchData = async () => {
      const studentId = localStorage.getItem('userId');
      console.log('AttendancePage: Student ID from localStorage:', studentId);

      if (!studentId) {
        setError('Student ID not found in localStorage.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('AttendancePage: Token:', token);

        const studentProfileResponse = await fetch(`${API_BASE_URL}/api/students/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const studentProfile = await studentProfileResponse.json();
        console.log('AttendancePage: Student Profile Data:', studentProfile);

        if (!studentProfileResponse.ok) {
          throw new Error(studentProfile.message || 'Failed to fetch student profile');
        }
        setStudentDetails(studentProfile);

        const studentClassId = studentProfile.classId?.className;
        const studentBatch = studentProfile.batch;
        console.log('AttendancePage: Student Class ID:', studentClassId, 'Student Batch:', studentBatch);
        if (!studentClassId) {
          setError('Student is not assigned to a class.');
          setLoading(false);
          return;
        }

        const today = new Date();
        const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
        console.log('AttendancePage: Today is:', dayOfWeek);

        const timetableResponse = await fetch(`${API_BASE_URL}/api/timetable/${studentClassId}/${dayOfWeek}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const fetchedTimetableData = await timetableResponse.json();
        console.log('AttendancePage: Fetched Timetable Data (before filter):', fetchedTimetableData);
        if (!timetableResponse.ok) {
          throw new Error(fetchedTimetableData.message || 'Failed to fetch timetable');
        }

        const filteredDailyTimetable = fetchedTimetableData.filter(lecture =>
          (lecture.batch === studentBatch || lecture.batch === null) &&
          lecture.startTime >= "09:00" && lecture.endTime <= "16:20"
        );
        console.log('AttendancePage: Filtered Daily Timetable (after filter):', filteredDailyTimetable);
        setDailyTimetable(filteredDailyTimetable);

        const attendanceRecordsResponse = await fetch(`${API_BASE_URL}/api/attendance/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const fetchedAttendanceRecords = await attendanceRecordsResponse.json();
        console.log('AttendancePage: Fetched ALL Attendance Records:', fetchedAttendanceRecords);
        if (!attendanceRecordsResponse.ok) {
          throw new Error(fetchedAttendanceRecords.message || 'Failed to fetch attendance records');
        }

        // Calculate overall attendance percentages from all records
        let overallTotalCount = 0;
        let overallPresentCount = 0;

        fetchedAttendanceRecords.forEach(record => {
          overallTotalCount++;
          if (record.status === 'Present') {
            overallPresentCount++;
          }
        });
        console.log('AttendancePage: Overall Total Records:', overallTotalCount, 'Overall Present Records:', overallPresentCount);

        const calculatedTotalAttendancePercentage = overallTotalCount > 0 ? (overallPresentCount / overallTotalCount) * 100 : 0;
        setTotalAttendancePercentage(calculatedTotalAttendancePercentage.toFixed(2));
        setAbsentPercentage((100 - calculatedTotalAttendancePercentage).toFixed(2));
        console.log('AttendancePage: Calculated Overall Percentage:', calculatedTotalAttendancePercentage.toFixed(2));

        // The following section is for 'Today's Lecture Attendance' table
        let totalCountToday = 0;
        let presentCountToday = 0;
        let absentCountToday = 0;

        const todaysDateString = today.toISOString().split('T')[0];
        const filteredAttendanceToday = fetchedAttendanceRecords.filter(record => {
          const recordDateString = new Date(record.date).toISOString().split('T')[0];
          return recordDateString === todaysDateString;
        });
        console.log('AttendancePage: Filtered Attendance Records for Today:', filteredAttendanceToday);

        // Calculate attendance for today's lectures from the filtered daily timetable and today's attendance records
        filteredDailyTimetable.forEach(lecture => {
            const attendanceStatus = filteredAttendanceToday.find(
                record => record.subject === lecture.subject &&
                          `${lecture.startTime}-${lecture.endTime}` === record.timeSlot
            );
            console.log('AttendancePage: Lecture:', lecture.subject, 'Status for Today:', attendanceStatus?.status || 'N/A');
            if (attendanceStatus) {
                totalCountToday++;
                if (attendanceStatus.status === 'Present') {
                    presentCountToday++;
                } else if (attendanceStatus.status === 'Absent') {
                    absentCountToday++;
                }
            } else {
                totalCountToday++; 
            }
        });
        console.log('AttendancePage: Today Total Lectures:', totalCountToday, 'Today Present:', presentCountToday, 'Today Absent:', absentCountToday);

        setTotalLectures(totalCountToday);
        setPresentLectures(presentCountToday);
        setAbsentLectures(absentCountToday);

        const mappedAttendance = filteredDailyTimetable.map(lecture => {
          const attendanceStatus = filteredAttendanceToday.find(
            record => record.subject === lecture.subject &&
                      `${lecture.startTime}-${lecture.endTime}` === record.timeSlot
          );
          return {
            ...lecture,
            status: attendanceStatus ? attendanceStatus.status : 'N/A',
          };
        });
        console.log('AttendancePage: Mapped Attendance Data for Table:', mappedAttendance);

        setAttendanceData(mappedAttendance);

      } catch (err) {
        console.error('AttendancePage: Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Loading attendance data...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (totalLectures === 0 && (!dailyTimetable || dailyTimetable.length === 0)) {
    return <Typography>No timetable entries for today or attendance records found for your batch.</Typography>;
  } else if (totalLectures === 0) {
    return <Typography>No attendance records found for your batch.</Typography>;
  } else if (!dailyTimetable || dailyTimetable.length === 0) {
    return <Typography>No timetable entries for today for your batch.</Typography>;
  }

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Today's Lecture Attendance</Typography>
        <Typography variant="h6" gutterBottom>Class: {studentDetails?.classId?.className || 'N/A'}</Typography>
        <Typography variant="h6" gutterBottom>Date: {new Date().toLocaleDateString()}</Typography>

        <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h5" gutterBottom>Overall Attendance Summary</Typography>
            <Typography variant="body1">Total Lectures: {totalLectures}</Typography>
            <Typography variant="body1">Present Lectures: {presentLectures}</Typography>
            <Typography variant="body1">Absent Lectures: {absentLectures}</Typography>
            <Typography variant="body1">Total Attendance Percentage: {totalAttendancePercentage}%</Typography>
            <Typography variant="body1">Absent Percentage: {absentPercentage}%</Typography>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
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
              {attendanceData.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.startTime} - {entry.endTime}</TableCell>
                  <TableCell>{entry.subjectName}</TableCell>
                  <TableCell>{entry.faculty.join(', ')}</TableCell>
                  <TableCell>{entry.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default AttendancePage;
