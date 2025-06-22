import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart'; // Add this import at the top

const drawerWidth = 240;

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole'); // Get user role from local storage
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    if (userRole === 'student') {
      const fetchStudentInfo = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/students/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setStudentInfo(data);
          }
        } catch (error) {
          console.error('Error fetching student info for layout:', error);
        }
      };
      fetchStudentInfo();
    }
  }, [userRole]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getMenuItems = () => {
    if (userRole === 'student') {
      return [
        { text: 'Profile', icon: <AccountCircleIcon />, path: '/student/profile' },
        { text: 'Attendance', icon: <EventNoteIcon />, path: '/student/attendance' },
        { text: 'Leave Requests', icon: <EventNoteIcon />, path: '/student/leave' },
        { text: 'Participation', icon: <PeopleIcon />, path: '/student/participation' },
        { text: 'Notifications', icon: <NotificationsIcon />, path: '/student/notifications' },
      ];
    } else if (userRole === 'teacher') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher' },
        { text: 'Students', icon: <PeopleIcon />, path: '/teacher/students' },
        { text: 'Attendance', icon: <EventNoteIcon />, path: '/teacher/attendance' },
        { text: 'Leave Approval', icon: <EventNoteIcon />, path: '/teacher/leave-approval' },
        { text: 'Notifications', icon: <NotificationsIcon />, path: '/teacher/notifications' },
        { text: 'Attendance Analysis', icon: <BarChartIcon />, path: '/teacher/attendance-analysis' }, // NEW ITEM

      ];
    } else if (userRole === 'parent') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/parent' },
        { text: 'Notifications', icon: <NotificationsIcon />, path: '/parent/notifications' },
      ];
    } else if (userRole === 'admin') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Students', icon: <PeopleIcon />, path: '/admin/students' },
        { text: 'Attendance', icon: <EventNoteIcon />, path: '/admin/attendance' },
        { text: 'Leave Approval', icon: <EventNoteIcon />, path: '/admin/leave-approval' },
        { text: 'Notifications', icon: <NotificationsIcon />, path: '/admin/notifications' },
        { text: 'Attendance Analysis', icon: <BarChartIcon />, path: '/admin/attendance-analysis' }, // NEW ITEM

      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Attendance System
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Attendance Management System
          </Typography>
          {userRole === 'student' && studentInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <AccountCircleIcon sx={{ mr: 1 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontSize: '0.9rem' }}>
                  {studentInfo.firstName} {studentInfo.lastName}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  ID: {studentInfo.rollNumber}
                </Typography>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout; 