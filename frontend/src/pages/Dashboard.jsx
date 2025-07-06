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
          const token = localStorage.getItem('token');
          const today = new Date();
          const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });

          // Fetch Today's Lecture Schedule
          const timetableResponse = await fetch(`https://attendence-system-backend.onrender.com/api/timetable/teacher/${teacherId}/${dayOfWeek}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (timetableResponse.ok) {
            const timetableData = await timetableResponse.json();
            setTodayLectures(timetableData);
          } else if (timetableResponse.status === 404) {
            setTodayLectures([]); // No timetable for today
          } else {
            let errorMessage = 'Failed to fetch timetable';
            try {
              const errorData = await timetableResponse.json();
              errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
              errorMessage = timetableResponse.statusText || errorMessage;
            }
            throw new Error(errorMessage);
          }

          // Fetch Today's Activity (Notifications for now)
          const notificationsResponse = await fetch(`https://attendence-system-backend.onrender.com/api/notifications/user/${teacherId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (notificationsResponse.ok) {
            const notificationsData = await notificationsResponse.json();
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
          } else if (notificationsResponse.status === 404) {
             setTodayActivity([]); // No notifications for today
          }else {
            let errorMessage = 'Failed to fetch notifications';
            try {
              const errorData = await notificationsResponse.json();
              errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
              errorMessage = notificationsResponse.statusText || errorMessage;
            }
            console.error('Error fetching notifications:', errorMessage);
            // Even if notifications fail, don't block timetable display
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