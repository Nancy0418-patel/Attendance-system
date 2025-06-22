// frontend/src/pages/Login.jsx


import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import API_BASE_URL from '../utils/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === 'email') {
      setEmailError(false);
    }
    if (e.target.name === 'password') {
      setPasswordError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let valid = true;
    if (!formData.email) {
      setEmailError(true);
      valid = false;
    }
    if (!formData.password) {
      setPasswordError(true);
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      // const response = await fetch('http://localhost:5000/api/auth/login', {
        const response = await fetch('${API_BASE_URL}/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userId', data._id);
      
      console.log('User role:', data.role);
      console.log('Redirecting to:', data.role === 'student' ? '/student' : '/');

      if (data.role === 'student') {
        navigate('/student');
      } else if (data.role === 'teacher') {
        navigate('/teacher');
      } else if (data.role === 'parent') {
        navigate('/parent');
      } else if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)'
    }}>
      <Paper
        elevation={8}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          borderRadius: '15px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
          background: '#fff',
        }}
      >
        <Box sx={{ 
          p: 2, 
          borderRadius: '50%', 
          bgcolor: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          color: 'white', 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)'
        }}>
          <img src="/assets/charusat_logo.png" alt="CHARUSAT Logo" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
        </Box>
        <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to your AttendSmart account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={emailError}
            helperText={emailError ? 'Email is required' : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={passwordError}
            helperText={passwordError ? 'Password is required' : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {/* Add visibility toggle icon if needed */}
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              padding: '10px 0',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Sign In
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/register" variant="body2" sx={{ color: '#555' }}>
              {"Don't have an account? Create Account"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login; 