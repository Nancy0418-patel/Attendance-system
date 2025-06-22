import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import API_BASE_URL from '../utils/api';

function LeaveApprovalPage() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString();
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, [filterStatus, filterStartDate, filterEndDate]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      const token = localStorage.getItem('token');

      let url = `${API_BASE_URL}/api/leaves`;
      const queryParams = new URLSearchParams();

      if (filterStatus) {
        queryParams.append('status', filterStatus);
      }
      if (filterStartDate) {
        queryParams.append('startDate', filterStartDate.toISOString());
      }
      if (filterEndDate) {
        queryParams.append('endDate', filterEndDate.toISOString());
      }

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch leave requests');
      }
      setLeaveRequests(data);
      console.log('LeaveApprovalPage: Fetched leave requests data:', data);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError(err.message);
      toast.error(`Error fetching leave requests: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    try {
      setError('');
      setSuccessMessage('');
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/leaves/${leaveId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Failed to update leave status';
        toast.error(`❌ ${errorMessage}`);
        throw new Error(errorMessage);
      }

      let message = `Leave request ${status.toLowerCase()} successfully!`;
      if (data.emailSendSuccess) {
        toast.success(`✅ ${message} Email notification sent.`);
      } else {
        const emailFailedMessage = `⚠️ ${message} Email notification failed: ${data.emailErrorMessage || 'Unknown error'}.`;
        toast.warning(emailFailedMessage);
      }

      fetchLeaveRequests(); // Refresh the list
    } catch (err) {
      console.error('Error updating leave status:', err);
      // If an error was already toasted by `if (!response.ok)` block, avoid re-toasting generic error
      if (!toast.isActive('update-error')) { // Check if an error toast is already active
        toast.error(`❌ Failed to update leave: ${err.message}`, { toastId: 'update-error' });
      }
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Leave Approval Page
      </Typography>

      {/* Alerts will now be handled by react-toastify */}
      {/* {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )} */}

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            label="Start Date"
            value={filterStartDate}
            onChange={(date) => setFilterStartDate(date)}
            slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
          />
          <DatePicker
            label="End Date"
            value={filterEndDate}
            onChange={(date) => setFilterEndDate(date)}
            slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              setFilterStatus('');
              setFilterStartDate(null);
              setFilterEndDate(null);
            }}
            sx={{ alignSelf: 'center' }}
          >
            Clear Filters
          </Button>
        </Box>
      </LocalizationProvider>

      {leaveRequests.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 3 }}>No leave requests to approve.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Roll Number</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Attendance (%)</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequests.map((request) => {
                console.log('Rendering request:', request);
                return (
                <TableRow key={request._id}>
                  <TableCell>{request.studentId?.rollNumber || 'N/A'}</TableCell>
                  <TableCell>{`${request.studentId?.firstName || ''} ${request.studentId?.lastName || ''}`.trim() || 'N/A'}</TableCell>
                  <TableCell
                    sx={{
                      color: request.studentId?.attendancePercentage < 75 ? 'error.main' : 'inherit',
                      fontWeight: request.studentId?.attendancePercentage < 75 ? 'bold' : 'normal',
                    }}
                  >
                    {request.studentId?.attendancePercentage !== undefined && request.studentId?.attendancePercentage !== null
                      ? `${request.studentId.attendancePercentage.toFixed(2)}%`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{formatDate(request.startDate || request.fromDate)}</TableCell>
                  <TableCell>{formatDate(request.endDate || request.toDate)}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell align="center">
                    {request.status === 'Pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleStatusUpdate(request._id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleStatusUpdate(request._id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {(request.status === 'Approved' || request.status === 'Rejected') && (
                      <Typography variant="body2" color={request.status === 'Approved' ? 'success.main' : 'error.main'}>
                        {request.status}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default LeaveApprovalPage;
