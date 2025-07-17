import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { AccountCircle, School, Email, Business, Phone, CalendarMonth, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StudentProfilePage = () => {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch student data from the backend
    const fetchStudentData = async () => {
      console.log("Attempting to fetch student data...");
      try {
        const token = localStorage.getItem('token');
        console.log("Token:", token);
        const response = await fetch('/api/students/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch student data');
        }

        setStudentData(data);

      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  if (!studentData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Student Profile
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AccountCircle />} 
          sx={{ backgroundColor: '#4285F4', '&:hover': { backgroundColor: '#3b7ae0' } }}
          onClick={() => navigate('/student/edit-profile')}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Main Profile Card */}
      <Paper elevation={3} sx={{
        p: 4,
        mb: 4,
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        color: 'white'
      }}>
        <Box display="flex" alignItems="center">
          <AccountCircle sx={{ fontSize: 80, mr: 3 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {studentData.firstName} {studentData.lastName}
            </Typography>
            <Typography variant="body1">Student ID: {studentData.rollNumber}</Typography>
            <Typography variant="body1">Class: {studentData.classId?.className || studentData.classId?.name}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Personal Information */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountCircle sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                <Typography variant="body1">{studentData.firstName} {studentData.lastName}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <School sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Class</Typography>
                <Typography variant="body1">{studentData.classId?.className || studentData.classId?.name}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Email sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                <Typography variant="body1">{studentData.email}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Business sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                <Typography variant="body1">{studentData.department || 'IT'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Phone sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                <Typography variant="body1">{studentData.phone || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarMonth sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Enrollment Date</Typography>
                <Typography variant="body1">{studentData.enrollmentDate || 'Not available'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Address Information Section */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Permanent Address
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Village</Typography>
                <Typography variant="body1">{studentData.permanentAddress?.village || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">City</Typography>
                <Typography variant="body1">{studentData.permanentAddress?.city || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">District</Typography>
                <Typography variant="body1">{studentData.permanentAddress?.district || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">State</Typography>
                <Typography variant="body1">{studentData.permanentAddress?.state || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Pincode</Typography>
                <Typography variant="body1">{studentData.permanentAddress?.pincode || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Local Address Information Section */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Local Address
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Village</Typography>
                <Typography variant="body1">{studentData.localAddress?.village || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">City</Typography>
                <Typography variant="body1">{studentData.localAddress?.city || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">District</Typography>
                <Typography variant="body1">{studentData.localAddress?.district || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">State</Typography>
                <Typography variant="body1">{studentData.localAddress?.state || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Pincode</Typography>
                <Typography variant="body1">{studentData.localAddress?.pincode || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Academic Information Section */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Academic Information
        </Typography>
        <Typography variant="body1">
          {/* Add academic information details here based on studentData */}
          No academic information available yet.
        </Typography>
      </Paper>

      {/* Attendance Summary Section */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Attendance Summary
        </Typography>
        <Typography variant="body1">
          {/* Add attendance summary details here based on studentData */}
          No attendance summary available yet.
        </Typography>
      </Paper>
    </Container>
  );
};

export default StudentProfilePage;