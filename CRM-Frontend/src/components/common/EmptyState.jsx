import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

const EmptyState = ({ message = 'No data found', action }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
        backgroundColor: '#fafafa',
        borderRadius: 2,
        border: '1px dashed #e0e0e0',
        my: 2,
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1, opacity: 0.6 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {message}
      </Typography>
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
};

export default EmptyState;
