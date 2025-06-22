import { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import API_BASE_URL from '../utils/api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    target: 'all',
    userIds: '',
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
      console.log('Fetching notifications for userId:', userId);
      if (!userId) {
        setError('User ID not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/notifications/${userId}`);
            // const response = await fetch(`http://localhost:5000/api/notifications/user/${userId}`);

      const data = await response.json();
      
      if (response.ok) {
        setNotifications(data.notifications); // Assuming backend sends { success: true, notifications: [...] }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      target: 'all',
      userIds: '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchNotifications();
          toast.success('Notification deleted successfully!');
        } else {
          const data = await response.json();
          setError(data.message);
          toast.error(`Failed to delete notification: ${data.message}`);
        }
      } catch (error) {
        setError('Failed to delete notification');
        toast.error('Failed to delete notification');
      }
    }
  };

  const handleSendPushNotification = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        target: formData.target,
      };

      if (formData.target === 'specific_users') {
        payload.ids = formData.userIds.split(',').map(id => id.trim()).filter(id => id);
      }

      const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOpenDialog(false);
        toast.success('Notification sent successfully!');
      } else {
        setError(data.message || 'Failed to send notification');
        toast.error(`Failed to send notification: ${data.message || 'Server error'}`);
      }
    } catch (error) {
      setError('Failed to send notification');
      toast.error('Failed to send notification');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'primary';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Notifications</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          New Notification
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              divider
              sx={{
                borderLeft: 4,
                borderColor: `${getTypeColor(notification.type)}.main`,
              }}
            >
              <ListItemText
                primary={notification.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {notification.message}
                    </Typography>
                    <br />
                    <Chip
                      label={notification.type}
                      size="small"
                      color={getTypeColor(notification.type)}
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={notification.target}
                      size="small"
                      variant="outlined"
                    />
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(notification.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>New Notification</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSendPushNotification} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Target</InputLabel>
              <Select
                name="target"
                value={formData.target}
                label="Target"
                onChange={handleChange}
              >
                <MenuItem value="all">All Users (Students, Teachers, Parents)</MenuItem>
                <MenuItem value="students">All Students</MenuItem>
                <MenuItem value="parents">All Parents</MenuItem>
                <MenuItem value="specific_users">Specific Users (Students/Teachers/Parents)</MenuItem>
              </Select>
            </FormControl>

            {formData.target === 'specific_users' && (
              <TextField
                fullWidth
                label="User IDs (comma-separated)"
                name="userIds"
                value={formData.userIds}
                onChange={handleChange}
                margin="normal"
                helperText="Enter comma-separated Student IDs or User IDs for teachers/admins"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" onClick={handleSendPushNotification}>
            Send Notification
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Notifications; 