import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import API_BASE_URL from '../utils/api';

function Attendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [selectedTimetableEntryId, setSelectedTimetableEntryId] = useState('');
  const [selectedTimetableEntry, setSelectedTimetableEntry] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      console.log(`Fetching timetable for class: ${selectedClass} on ${selectedDate.toDateString()}`);
      const currentClass = classes.find(cls => cls._id === selectedClass);
      if (currentClass) {
        fetchTimetableEntries(currentClass.className);
      }
    }
  }, [selectedClass, selectedDate, classes]);

  useEffect(() => {
    if (selectedTimetableEntryId && timetableEntries.length > 0) {
      console.log('Selected Timetable Entry ID:', selectedTimetableEntryId);
      const entry = timetableEntries.find(e => e._id === selectedTimetableEntryId);
      setSelectedTimetableEntry(entry);

      if (entry) {
        const batchToFetch = entry.batch || '';
        console.log('Found matching timetable entry. Fetching students with batch:', batchToFetch);
        fetchStudents(batchToFetch);
      } else {
        console.log('No matching timetable entry found for selected ID. Clearing students.');
        setStudents([]);
        setFilteredStudents([]);
        setSelectedTimetableEntry(null);
      }
    } else {
      setStudents([]);
      setFilteredStudents([]);
      setSelectedTimetableEntry(null);
    }
  }, [selectedTimetableEntryId, timetableEntries, selectedClass]);

  const fetchClasses = async () => {
    try {
      // const response = await fetch('http://localhost:5000/api/classes');
      const response = await fetch(`${API_BASE_URL}/api/classes`);
      const data = await response.json();
      if (response.ok) {
        setClasses(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch classes');
    }
  };

  const fetchStudents = async (batch = '') => {
    try {
      setLoading(true);
      // let url = `http://localhost:5000/api/classes/${selectedClass}/students`;
      let url = `${API_BASE_URL}/api/classes/${selectedClass}/students`;
      if (batch !== null && batch !== undefined && batch !== '') {
        url += `?batch=${batch}`;
      } else if (batch === '') {
        url += `?batch=null`;
      }
      
      console.log('Fetching students from:', url);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Students data:', data);

      if (response.ok) {
        setStudents(data);
        setFilteredStudents(data);
        const initialAttendance = {};
        data.forEach(student => {
          initialAttendance[student._id] = 'Present';
        });
        setAttendance(initialAttendance);
      } else {
        setError(data.message);
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetableEntries = async (className) => {
    if (!className || !selectedDate) return;

    try {
      setError('');
      const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' });
      console.log('Sending timetable request for class:', className, 'and day:', dayOfWeek);
      
      // const response = await fetch(`http://localhost:5000/api/timetable/${encodeURIComponent(className)}/${dayOfWeek}`);
      const response = await fetch(`${API_BASE_URL}/api/timetable/${encodeURIComponent(className)}/${dayOfWeek}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch timetable: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Timetable data received:', data);

      if (data.length > 0) {
        setTimetableEntries(data);
        setSelectedTimetableEntryId(data[0]._id);
      } else {
        setTimetableEntries([]);
        setSelectedTimetableEntryId('');
        setSelectedTimetableEntry(null);
        setError('No timetable entries found for this day');
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setError('Failed to fetch timetable entries: ' + error.message);
      setTimetableEntries([]);
      setSelectedTimetableEntryId('');
      setSelectedTimetableEntry(null);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status.charAt(0).toUpperCase() + status.slice(1)
    }));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedDate || !selectedTimetableEntry) {
      setError('Please select Class, Date, and Subject');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: selectedClass,
          date: selectedDate.toISOString(),
          subject: selectedTimetableEntry.subject,
          timeSlot: `${selectedTimetableEntry.startTime}-${selectedTimetableEntry.endTime}`,
          attendance: Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            status
          }))
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        setSuccessMessage('Attendance saved successfully!');
        setStudents([]);
        setFilteredStudents([]);
        setAttendance({});
        setSelectedTimetableEntryId('');
        setSelectedTimetableEntry(null);
      } else {
        throw new Error(data.message || 'Failed to save attendance');
      }
    } catch (error) {
      setError('Failed to save attendance: ' + error.message);
      setSuccessMessage('');
    }
  };

  const displayTimetableEntries = timetableEntries.map(entry => ({
    _id: entry._id,
    display: `${entry.subjectName}${entry.batch ? ` (Lab - Batch ${entry.batch})` : ''} (${entry.startTime}-${entry.endTime})`,
    subjectCode: entry.subject,
    batch: entry.batch,
    timeSlot: `${entry.startTime}-${entry.endTime}`
  }));

  console.log('Rendering Attendance component:');
  console.log('Current timetableEntries (raw):', timetableEntries);
  console.log('Display timetableEntries for dropdown:', displayTimetableEntries);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Attendance
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              label="Class"
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setTimetableEntries([]);
                setSelectedTimetableEntryId('');
                setSelectedTimetableEntry(null);
                setStudents([]);
                setFilteredStudents([]);
                setAttendance({});
              }}
            >
              {classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>
                  {cls.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue);
                setTimetableEntries([]);
                setSelectedTimetableEntryId('');
                setSelectedTimetableEntry(null);
                setStudents([]);
                setFilteredStudents([]);
                setAttendance({});
              }}
              renderInput={(params) => <TextField {...params} sx={{ width: 150, mr: 2, mb: 2 }} />}
            />
          </LocalizationProvider>

          <FormControl sx={{ minWidth: 200, mr: 2, mb: 2 }}>
            <InputLabel id="subject-select-label">Subject</InputLabel>
            <Select
              labelId="subject-select-label"
              id="subject-select"
              value={selectedTimetableEntryId}
              label="Subject"
              onChange={(e) => setSelectedTimetableEntryId(e.target.value)}
              disabled={timetableEntries.length === 0}
            >
              {displayTimetableEntries.map((entry) => (
                <MenuItem key={entry._id} value={entry._id}>
                  {entry.display}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && !loading && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {students.length > 0 && selectedClass && selectedDate && selectedTimetableEntry && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Student List for {selectedTimetableEntry?.subjectName} {selectedTimetableEntry?.batch ? `(Batch ${selectedTimetableEntry.batch})` : ''} ({selectedTimetableEntry?.startTime}-{selectedTimetableEntry?.endTime})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Roll Number</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                    <TableCell>
                      {attendance[student._id] || 'Present'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleAttendanceChange(student._id, 'Present')}
                        color="inherit"
                        sx={{ color: attendance[student._id] === 'Present' ? 'primary.main' : 'inherit' }}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleAttendanceChange(student._id, 'Absent')}
                        color="inherit"
                        sx={{ color: attendance[student._id] === 'Absent' ? 'error.main' : 'inherit' }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              Save Attendance
            </Button>
          </Box>
        </Paper>
      )}

      {!loading && !error && students.length === 0 && selectedClass && selectedDate && selectedTimetableEntry && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No students found for the selected class, date, and subject. Please ensure timetable entries and student data are available.
        </Alert>
      )}

      {!loading && !error && timetableEntries.length === 0 && selectedClass && selectedDate && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No timetable entries found for the selected class and date.
        </Alert>
      )}
    </Box>
  );
}

export default Attendance;