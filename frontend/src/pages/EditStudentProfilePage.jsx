import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, TextField } from '@mui/material';
import { AccountCircle, School, Email, Business, Phone, CalendarMonth, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditStudentProfilePage = () => {
  const [studentData, setStudentData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    permanentAddress: {
      village: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
    },
    localAddress: {
      village: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
    },
    // Add other fields that can be edited
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      console.log("Attempting to fetch student data for editing...");
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/students/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch student data');
        }

        setStudentData(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          permanentAddress: {
            village: data.permanentAddress?.village || '',
            city: data.permanentAddress?.city || '',
            district: data.permanentAddress?.district || '',
            state: data.permanentAddress?.state || '',
            pincode: data.permanentAddress?.pincode || '',
          },
          localAddress: {
            village: data.localAddress?.village || '',
            city: data.localAddress?.city || '',
            district: data.localAddress?.district || '',
            state: data.localAddress?.state || '',
            pincode: data.localAddress?.pincode || '',
          },
          // Populate other fields
        });

      } catch (error) {
        console.error('Error fetching student data for editing:', error);
        toast.error(error.message);
      }
    };

    fetchStudentData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, subField] = name.split('.');

    if (subField) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/students/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      navigate('/student'); // Navigate back to the profile page

    } catch (error) {
      console.error('Error updating student profile:', error);
      toast.error(error.message);
    }
  };

  if (!studentData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Edit Student Profile
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <AccountCircle sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <AccountCircle sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
            Permanent Address
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Village"
                name="permanentAddress.village"
                value={formData.permanentAddress.village}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Home sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="permanentAddress.city"
                value={formData.permanentAddress.city}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Home sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="District"
                name="permanentAddress.district"
                value={formData.permanentAddress.district}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Home sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="permanentAddress.state"
                value={formData.permanentAddress.state}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Home sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pincode"
                name="permanentAddress.pincode"
                value={formData.permanentAddress.pincode}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Home sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
            Local Address
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Village"
                name="localAddress.village"
                value={formData.localAddress.village}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Home sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="localAddress.city"
                value={formData.localAddress.city}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Home sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="District"
                name="localAddress.district"
                value={formData.localAddress.district}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Home sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="localAddress.state"
                value={formData.localAddress.state}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Home sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pincode"
                name="localAddress.pincode"
                value={formData.localAddress.pincode}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Home sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
              Save Changes
            </Button>
            <Button variant="outlined" onClick={() => navigate('/student')}>
              Cancel
            </Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditStudentProfilePage; 