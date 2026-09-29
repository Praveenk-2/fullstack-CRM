import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

const ErrorMessage = ({ title = 'Error', message }) => {
  if (!message) return null;

  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error">
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
