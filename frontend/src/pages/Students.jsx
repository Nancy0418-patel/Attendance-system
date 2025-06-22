// frontend/src/pages/Students.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import API_BASE_URL from '../utils/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    batch: '',
    classId: '',
    phone: '',
    rollNumber: '',
    parentContact: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const columns = [
    { field: 'rollNumber', headerName: 'Roll Number', width: 130 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'batch', headerName: 'Batch', width: 80 },
    { field: 'classId', headerName: 'Class', width: 100, valueGetter: (params) => params.row.classId?.className || ''  },
    { field: 'phone', headerName: 'Phone', width: 130 },
    {
      field: 'parentContact',
      headerName: 'Parent',
      width: 200,
      valueGetter: (params) =>
        params.row.parentContact && params.row.parentContact.name
          ? `${params.row.parentContact.name} (${params.row.parentContact.phone})`
          : '',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
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

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students`);
      const data = await response.json();
      if (response.ok) {
        setStudents(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      batch: '',
      classId: '',
      phone: '',
      rollNumber: '',
      parentContact: {
        name: '',
        email: '',
        phone: '',
      },
    });
    setOpenDialog(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      email: student.email || '',
      batch: student.batch || '',
      classId: student.classId || '',
      phone: student.phone || '',
      rollNumber: student.rollNumber || '',
      parentContact: {
        name: student.parentContact?.name || '',
        email: student.parentContact?.email || '',
        phone: student.parentContact?.phone || '',
      },
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchStudents();
        } else {
          const data = await response.json();
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to delete student');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedStudent
        ? `${API_BASE_URL}/api/students/${selectedStudent._id}`
        : `${API_BASE_URL}/api/students`;
      const response = await fetch(url, {
        method: selectedStudent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setOpenDialog(false);
        fetchStudents();
      } else {
        const data = await response.json();
        setError(data.message || data.error);
      }
    } catch (error) {
      setError('Failed to save student');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Students</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Student
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={students}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
        />
      </Paper>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedStudent ? 'Edit Student' : 'Add New Student'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Class</InputLabel>
              <Select
                name="classId"
                value={formData.classId}
                label="Class"
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.className || cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Batch"
              name="batch"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              margin="normal"
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Parent Contact</Typography>
            <TextField
              fullWidth
              label="Parent Name"
              name="parentName"
              value={formData.parentContact.name}
              onChange={(e) => setFormData({ ...formData, parentContact: { ...formData.parentContact, name: e.target.value } })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Parent Email"
              name="parentEmail"
              value={formData.parentContact.email}
              onChange={(e) => setFormData({ ...formData, parentContact: { ...formData.parentContact, email: e.target.value } })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Parent Phone"
              name="parentPhone"
              value={formData.parentContact.phone}
              onChange={(e) => setFormData({ ...formData, parentContact: { ...formData.parentContact, phone: e.target.value } })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedStudent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Students; 