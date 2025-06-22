import React from 'react';
import { Box, Typography, Paper, Grid, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Book as BookIcon, AccessTime as AccessTimeIcon, People as PeopleIcon, EventNote as EventNoteIcon, Notifications as NotificationsIcon, CalendarMonth as CalendarMonthIcon, School as SchoolIcon } from '@mui/icons-material';

function TeacherDashboardPage() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Today's Schedule Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Today's Schedule
              </Typography>
              <Button size="small" sx={{ textTransform: 'none' }}>
                View All <Box component="span" sx={{ ml: 0.5, fontSize: '0.8rem' }}>&gt;</Box>
              </Button>
            </Box>
            <List>
              <ListItem sx={{ borderBottom: '1px solid #eee', pb: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <BookIcon sx={{ mr: 1, color: '#4285F4' }} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Mathematics - Grade 10A</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">10:30 AM • Room 204</Typography>
                  </Box>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" color="text.secondary">28 students</Typography>
                  <Button size="small" sx={{ textTransform: 'none', color: '#4285F4' }}>
                    Take Attendance
                  </Button>
                </Box>
              </ListItem>
              <ListItem sx={{ borderBottom: '1px solid #eee', pb: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <BookIcon sx={{ mr: 1, color: '#4285F4' }} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Physics - Grade 11B</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">2:15 PM • Lab 3</Typography>
                  </Box>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" color="text.secondary">24 students</Typography>
                  <Button size="small" sx={{ textTransform: 'none', color: '#4285F4' }}>
                    Take Attendance
                  </Button>
                </Box>
              </ListItem>
              <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <BookIcon sx={{ mr: 1, color: '#4285F4' }} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Mathematics - Grade 9C</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">3:45 PM • Room 204</Typography>
                  </Box>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" color="text.secondary">26 students</Typography>
                  <Button size="small" sx={{ textTransform: 'none', color: '#4285F4' }}>
                    Take Attendance
                  </Button>
                </Box>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Recent Activity
              </Typography>
              <Button size="small" sx={{ textTransform: 'none' }}>
                View All
              </Button>
            </Box>
            <List>
              <ListItem sx={{ borderBottom: '1px solid #eee', pb: 1.5, mb: 1.5 }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <PeopleIcon sx={{ color: '#FFC107' }} />
                </ListItemIcon>
                <ListItemText primary="Attendance marked for Grade 10A - M..." secondary="2 hours ago" />
              </ListItem>
              <ListItem sx={{ borderBottom: '1px solid #eee', pb: 1.5, mb: 1.5 }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <BookIcon sx={{ color: '#4CAF50' }} />
                </ListItemIcon>
                <ListItemText primary="New assignment submitted by Sarah J..." secondary="3 hours ago" />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <NotificationsIcon sx={{ color: '#F44336' }} />
                </ListItemIcon>
                <ListItemText primary="Parent meeting scheduled for tomorrow" secondary="5 hours ago" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }} mb={2}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button variant="contained" fullWidth startIcon={<EventNoteIcon />} sx={{
                  backgroundColor: '#4285F4',
                  '&:hover': { backgroundColor: '#3b7ae0' },
                  py: 1.5,
                  borderRadius: '8px'
                }}>
                  Take Attendance
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button variant="contained" fullWidth startIcon={<PeopleIcon />} sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#449d48' },
                  py: 1.5,
                  borderRadius: '8px'
                }}>
                  View Students
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button variant="contained" fullWidth startIcon={<CalendarMonthIcon />} sx={{
                  backgroundColor: '#9C27B0',
                  '&:hover': { backgroundColor: '#822094' },
                  py: 1.5,
                  borderRadius: '8px'
                }}>
                  Schedule Class
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TeacherDashboardPage; 