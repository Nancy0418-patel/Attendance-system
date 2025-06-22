// frontend/src/pages/LeavePage.jsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import API_BASE_URL from '../utils/api';

const LeavePage = () => {
  const [leaveData, setLeaveData] = useState({
    reason: '',
    startDate: '',
    endDate: ''
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const studentId = localStorage.getItem('userId');
      if (!studentId) {
        setError('Student ID not found in localStorage.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/leaves/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch leave history');
      }
      setLeaveHistory(data);
    } catch (err) {
      console.error('Error fetching leave history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (leaveId) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/leaves/${leaveId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete leave request');
        }

        setSuccessMessage('Leave request deleted successfully!');
        fetchLeaveHistory(); // Refresh the leave history
      } catch (err) {
        console.error('Error deleting leave request:', err);
        setError(err.message || 'Failed to delete leave request.');
        setSuccessMessage('');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccessMessage('');
      const studentId = localStorage.getItem('userId');
      if (!studentId) {
        setError('Student ID not found. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/leaves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...leaveData, studentId })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit leave request');
      }

      setSuccessMessage('Leave request submitted successfully!');
      setLeaveData({ reason: '', startDate: '', endDate: '' });
      fetchLeaveHistory(); // Refresh the leave history
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setError(error.message || 'Failed to submit leave request.');
      setSuccessMessage('');
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Request Leave</Typography>

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

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Reason"
            name="reason"
            value={leaveData.reason}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            value={leaveData.startDate}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="date"
            value={leaveData.endDate}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Submit Leave Request
          </Button>
        </form>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>Your Leave History</Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : leaveHistory.length === 0 ? (
            <Typography>No past leave requests found.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reason</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaveHistory.map((leave) => (
                    <TableRow key={leave._id}>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{leave.status}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDelete(leave._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LeavePage;
