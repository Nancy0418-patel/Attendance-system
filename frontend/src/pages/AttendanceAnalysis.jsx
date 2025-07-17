import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { exportTableToPDF } from "../utils/exportPDF";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import API_BASE_URL from '../utils/api';

function exportToCSV(data, filename) {
  const header = Object.keys(data[0] || {}).join(",") + "\n";
  const rows = data.map(row => Object.values(row).join(",")).join("\n");
  const csv = header + rows;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}

export default function AttendanceAnalysis() {
  const [summary, setSummary] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all classes on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/classes`)
      .then(res => res.json())
      .then(data => setClasses(data));
  }, []);

  // Fetch attendance summary for selected class
  useEffect(() => {
    if (!selectedClass) {
      setSummary([]);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE_URL}/api/attendance-analysis/summary?classId=${selectedClass}`)
      .then(res => res.json())
      .then(data => setSummary(data))
      .finally(() => setLoading(false));
  }, [selectedClass]);

  // Fetch detail for selected student
  useEffect(() => {
    if (selectedStudent) {
      fetch(`${API_BASE_URL}/api/attendance-analysis/student/${selectedStudent}`)
        .then(res => res.json())
        .then(setStudentDetail);
    } else {
      setStudentDetail([]);
    }
  }, [selectedStudent]);

  // Export summary as CSV
  const handleExportSummary = () => {
    // Exclude studentId and email from export
    const exportData = summary.map(({ studentId, email, ...rest }) => rest);
    exportToCSV(exportData, "attendance_summary.csv");
  };

  // Export student detail as CSV
  const handleExportDetail = () => {
    exportToCSV(studentDetail, "attendance_detail.csv");
  };

  // Export summary as PDF
  const handleExportSummaryPDF = () => {
    if (!summary.length) return;
    const headers = ["Name", "Roll Number", "Total", "Present", "Percentage"];
    const data = summary.map(s => [s.name, s.rollNumber, s.total, s.present, s.percentage + "%"]);
    exportTableToPDF(headers, data, "attendance_summary.pdf");
  };

  // Export student detail as PDF
  const handleExportDetailPDF = () => {
    if (!studentDetail.length) return;
    const headers = ["Date", "Subject", "Time Slot", "Status", "Remarks"];
    const data = studentDetail.map(rec => [
      new Date(rec.date).toLocaleDateString(),
      rec.subject,
      rec.timeSlot,
      rec.status,
      rec.remarks || "-"
    ]);
    exportTableToPDF(headers, data, "attendance_detail.pdf");
  };

  // Calculate overall stats for cards
  const totalStudents = summary.length;
  const avgAttendance = summary.length ? (summary.reduce((acc, s) => acc + (parseFloat(s.percentage) || 0), 0) / summary.length).toFixed(2) : 0;
  const highAttendance = summary.filter(s => s.percentage >= 75).length;
  const lowAttendance = summary.filter(s => s.percentage < 75).length;

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 1, sm: 3 } }}>
      <Typography variant="h4" fontWeight="bold" color="primary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BarChartIcon fontSize="large" /> Attendance Analysis
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {/* Class Filter Dropdown */}
      <Box mb={4}>
        <FormControl sx={{ minWidth: 240 }}>
          <InputLabel id="class-select-label">Select Class</InputLabel>
          <Select
            labelId="class-select-label"
            value={selectedClass}
            label="Select Class"
            onChange={e => {
              setSelectedClass(e.target.value);
              setSelectedStudent(null);
              setStudentDetail([]);
            }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {classes.map(cls => (
              <MenuItem key={cls._id} value={cls._id}>{cls.className}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* Show message if no class selected */}
      {!selectedClass && (
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Please select a class to view attendance analysis.
        </Typography>
      )}
      {/* Only show the rest if a class is selected */}
      {selectedClass && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ borderRadius: '12px', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">Total Students</Typography>
                  <Typography variant="h4" color="primary" fontWeight="bold">{totalStudents}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ borderRadius: '12px', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">Avg. Attendance</Typography>
                  <Typography variant="h4" color="success.main" fontWeight="bold">{avgAttendance}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ borderRadius: '12px', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">Above 75%</Typography>
                  <Typography variant="h4" color="info.main" fontWeight="bold">{highAttendance}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ borderRadius: '12px', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">Below 75%</Typography>
                  <Typography variant="h4" color="error.main" fontWeight="bold">{lowAttendance}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Above/Below 75% and Average Attendance Charts Side by Side */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
                  Students Above vs Below 75%
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={[
                      { name: 'Above 75%', value: highAttendance },
                      { name: 'Below 75%', value: lowAttendance },
                    ]}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#4285F4" name="Number of Students" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
                  Average Attendance
                </Typography>
                <ResponsiveContainer width={320} height={320}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Present', value: parseFloat(avgAttendance) },
                        { name: 'Absent', value: 100 - parseFloat(avgAttendance) },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      <Cell key="present" fill="#4caf50" />
                      <Cell key="absent" fill="#f44336" />
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>

          {/* Export Buttons */}
          <Box display="flex" gap={2} mb={2}>
            <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={handleExportSummary}>
              Download Summary CSV
            </Button>
            <Button variant="contained" color="error" startIcon={<AssessmentIcon />} onClick={handleExportSummaryPDF}>
              Download Summary PDF
            </Button>
          </Box>
          {/* Summary Table */}
          <Paper elevation={3} sx={{ mb: 6, borderRadius: '12px', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Roll Number</b></TableCell>
                    <TableCell><b>Class</b></TableCell>
                    <TableCell><b>Total</b></TableCell>
                    <TableCell><b>Present</b></TableCell>
                    <TableCell><b>Percentage</b></TableCell>
                    <TableCell><b>Action</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {summary.map(s => (
                    <TableRow key={s.studentId} hover selected={selectedStudent === s.studentId}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.rollNumber}</TableCell>
                      <TableCell>{s.className || s.class || 'N/A'}</TableCell>
                      <TableCell>{s.total}</TableCell>
                      <TableCell>{s.present}</TableCell>
                      <TableCell>{s.percentage}%</TableCell>
                      <TableCell>
                        <Tooltip title="View Detail">
                          <IconButton color="primary" onClick={() => setSelectedStudent(s.studentId)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {/* Student Detail Section */}
          {studentDetail.length > 0 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" color="secondary" mb={2}>
                Attendance Detail
              </Typography>
              <Box display="flex" gap={2} mb={2}>
                <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={handleExportDetail}>
                  Download Detail CSV
                </Button>
                <Button variant="contained" color="error" startIcon={<AssessmentIcon />} onClick={handleExportDetailPDF}>
                  Download Detail PDF
                </Button>
              </Box>
              <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                        <TableCell><b>Date</b></TableCell>
                        <TableCell><b>Subject</b></TableCell>
                        <TableCell><b>Time Slot</b></TableCell>
                        <TableCell><b>Status</b></TableCell>
                        <TableCell><b>Remarks</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentDetail.map((rec, i) => (
                        <TableRow key={i} hover>
                          <TableCell>{new Date(rec.date).toLocaleDateString()}</TableCell>
                          <TableCell>{rec.subject}</TableCell>
                          <TableCell>{rec.timeSlot}</TableCell>
                          <TableCell>{rec.status}</TableCell>
                          <TableCell>{rec.remarks || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
