import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import API_BASE_URL from '../utils/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const CLASSES = ['IT', 'CE', 'ME', 'EE']; // Add more classes as needed
const BATCHES = [null, 'A', 'B', 'C', 'D']; // null represents no batch (theory class)

function TimetableManagementPage() {
  const [timetable, setTimetable] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    className: '',
    day: '',
    batch: '',
    subject: '',
    subjectName: '',
    faculty: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/timetable`);
      const data = await response.json();
      setTimetable(data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  const handleOpenDialog = (slot = null) => {
    if (slot) {
      setEditingSlot(slot);
      setFormData({
        ...slot,
        faculty: Array.isArray(slot.faculty) ? slot.faculty.join(', ') : slot.faculty
      });
    } else {
      setEditingSlot(null);
      setFormData({
        className: '',
        day: '',
        batch: '',
        subject: '',
        subjectName: '',
        faculty: '',
        startTime: '',
        endTime: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSlot(null);
  };

  const handleSubmit = async () => {
    try {
      const dataToSubmit = {
        ...formData,
        faculty: formData.faculty.split(',').map(f => f.trim())
      };

      const url = editingSlot
        ? `${API_BASE_URL}/api/timetable/${editingSlot._id}`
        : `${API_BASE_URL}/api/timetable`;
      
      const method = editingSlot ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error('Failed to save timetable slot');
      }

      fetchTimetable();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving timetable slot:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/timetable/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete timetable slot');
        }

        fetchTimetable();
      } catch (error) {
        console.error('Error deleting timetable slot:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Timetable Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Slot
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Faculty</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timetable.map((slot) => (
              <TableRow key={slot._id}>
                <TableCell>{slot.day}</TableCell>
                <TableCell>{`${slot.startTime} - ${slot.endTime}`}</TableCell>
                <TableCell>{slot.className}</TableCell>
                <TableCell>{slot.batch || '-'}</TableCell>
                <TableCell>{slot.subjectName}</TableCell>
                <TableCell>{Array.isArray(slot.faculty) ? slot.faculty.join(', ') : slot.faculty}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(slot)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(slot._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSlot ? 'Edit Timetable Slot' : 'Add New Timetable Slot'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Day"
                name="day"
                value={formData.day}
                onChange={handleChange}
              >
                {DAYS.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Class"
                name="className"
                value={formData.className}
                onChange={handleChange}
              >
                {CLASSES.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
              >
                {BATCHES.map((batch) => (
                  <MenuItem key={batch || 'none'} value={batch}>
                    {batch || 'Theory'}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Subject Code"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject Name"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Faculty (comma-separated)"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                helperText="Enter faculty names separated by commas"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingSlot ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TimetableManagementPage; 