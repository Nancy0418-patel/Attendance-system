import React from 'react';
import { Box, Typography } from '@mui/material';

function ParentDashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Parent Dashboard Page
      </Typography>
      <Typography variant="body1">
        This page will display the parent's dashboard and student growth information.
      </Typography>
    </Box>
  );
}

export default ParentDashboardPage; 