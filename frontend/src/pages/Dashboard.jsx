import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { EventNote as EventNoteIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { apiGet, getAuthHeader } from '../utils/apiHelper';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todayLectures, setTodayLectures] = useState([]);
  const [todayActivity, setTodayActivity] = useState([]); // Placeholder for activity, will fetch real data later
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      setTeacherId(id);
    } else {
      setError('Teacher ID not found. Please log in again.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (teacherId) {
      const fetchTeacherDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
          const today = new Date();
          const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });

          // Fetch Today's Lecture Schedule
          const { data: timetableData, error: timetableError } = await apiGet(`/api/timetable/teacher/${teacherId}/${dayOfWeek}`, getAuthHeader());
          
          if (timetableError) {
            if (timetableError.includes('404')) {
              setTodayLectures([]); // No timetable for today
            } else {
              throw new Error(timetableError);
            }
          } else {
            setTodayLectures(timetableData);
          }

          // Fetch Today's Activity (Notifications for now)
          const { data: notificationsData, error: notificationsError } = await apiGet(`/api/notifications/user/${teacherId}`, getAuthHeader());

          if (notificationsError) {
            if (notificationsError.includes('404')) {
              setTodayActivity([]); // No notifications for today
            } else {
              console.error('Error fetching notifications:', notificationsError);
              // Even if notifications fail, don't block timetable display
            }
          } else {
            // Filter notifications for today
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const filteredNotifications = notificationsData.filter(notification => {
              const notificationDate = new Date(notification.createdAt);
              return notificationDate >= startOfDay && notificationDate <= endOfDay;
            });
            setTodayActivity(filteredNotifications);
          }

        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          setError(err.message || 'Failed to load dashboard data.');
        } finally {
          setLoading(false);
        }
      };

      fetchTeacherDashboardData();
    }
  }, [teacherId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Teacher Dashboard
      </Typography>

      {/* Today's Lecture Schedule */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventNoteIcon sx={{ mr: 1 }} />
          <Typography variant="h5">Today's Lecture Schedule</Typography>
        </Box>
        {todayLectures.length > 0 ? (
          <List>
            {todayLectures.map((lecture, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${lecture.subjectName} (${lecture.startTime} - ${lecture.endTime})`}
                    secondary={`Class: ${lecture.className} ${lecture.batch ? `(Batch ${lecture.batch})` : ''} - Room: ${lecture.room}`}
                  />
                </ListItem>
                {index < todayLectures.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No lectures scheduled for today.
          </Typography>
        )}
      </Paper>

      {/* Today's Activity */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h5">Today's Activity</Typography>
        </Box>
        {todayActivity.length > 0 ? (
          <List>
            {todayActivity.map((activity, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemText
                    primary={activity.message}
                    secondary={new Date(activity.createdAt).toLocaleTimeString()}
                  />
                </ListItem>
                {index < todayActivity.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No recent activity for today.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Dashboard;