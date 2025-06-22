import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../utils/api';

const ParticipationPage = () => {
  const navigate = useNavigate();
  const [participationData, setParticipationData] = useState({
    activity: '',
    date: ''
  });
  const [participationRecords, setParticipationRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('ParticipationPage: useEffect running.');
    const fetchStudentAndParticipationRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('ParticipationPage: Token:', token);
        if (!token) {
          setLoading(false);
          setError('No authentication token found.');
          console.log('ParticipationPage: No token found.');
          return;
        }

        // First, fetch student profile to get studentId
        console.log('ParticipationPage: Fetching student profile...');
        const studentProfileResponse = await fetch(`${API_BASE_URL}/api/students/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const studentProfileData = await studentProfileResponse.json();
        console.log('ParticipationPage: Student profile response status:', studentProfileResponse.status);
        console.log('ParticipationPage: Student profile data:', studentProfileData);

        if (!studentProfileResponse.ok) {
          throw new Error(studentProfileData.message || 'Failed to fetch student profile');
        }

        const studentId = studentProfileData._id;
        console.log('ParticipationPage: Student ID:', studentId);
        if (!studentId) {
          setLoading(false);
          setError('Student ID not found in profile.');
          console.log('ParticipationPage: Student ID not found.');
          return;
        }

        // Then, fetch participation records for that student
        console.log(`ParticipationPage: Fetching participation records for student ID: ${studentId}...`);
        const participationResponse = await fetch(`${API_BASE_URL}/api/participations/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const participationRecordsData = await participationResponse.json();
        console.log('ParticipationPage: Participation records response status:', participationResponse.status);
        console.log('ParticipationPage: Participation records data:', participationRecordsData);

        if (participationResponse.ok) {
          setParticipationRecords(participationRecordsData);
        } else {
          console.error('ParticipationPage: Failed to fetch participation records:', participationRecordsData.message);
          setError(participationRecordsData.message || 'Failed to fetch participation records.');
        }
      } catch (err) {
        console.error('ParticipationPage: Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAndParticipationRecords();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParticipationData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('ParticipationPage: Submitting new activity:', participationData);
    try {
      const response = await fetch(`${API_BASE_URL}/api/participations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(participationData)
      });
      const data = await response.json();
      console.log('ParticipationPage: Add activity response status:', response.status);
      console.log('ParticipationPage: Add activity response data:', data);
      
      if (response.ok) {
        alert('Participation activity added successfully!');
        setParticipationData({ activity: '', date: '' });
        // Re-fetch participation records after adding new one
        console.log('ParticipationPage: Re-fetching records after successful submission...');
        setLoading(true); // Set loading to true to show spinner while re-fetching
        setError(null); // Clear any previous errors
        const token = localStorage.getItem('token');
        const studentProfileResponse = await fetch(`${API_BASE_URL}/api/students/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const studentProfileData = await studentProfileResponse.json();
        const studentId = studentProfileData._id;

        const participationResponse = await fetch(`${API_BASE_URL}/api/participations/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const participationRecordsData = await participationResponse.json();

        if (participationResponse.ok) {
          setParticipationRecords(participationRecordsData);
          console.log('ParticipationPage: Records re-fetched successfully:', participationRecordsData);
        } else {
          console.error('ParticipationPage: Failed to re-fetch participation records:', participationRecordsData.message);
          setError(participationRecordsData.message || 'Failed to re-fetch participation records.');
        }
        setLoading(false);

      } else {
        alert(`Failed to add participation activity: ${data.error || response.statusText}`);
      }
    } catch (error) {
      console.error('ParticipationPage: Error adding participation activity:', error);
      alert('Failed to add participation activity.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Add Participation Activity</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Activity"
            name="activity"
            value={participationData.activity}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={participationData.date}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Activity
          </Button>
        </form>
      </Box>

      <Box my={4}>
        <Typography variant="h4" gutterBottom>Past Participation Activities</Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Error: {error}</Alert>
        ) : participationRecords.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Activity</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participationRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.eventName}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No participation activities found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default ParticipationPage;
