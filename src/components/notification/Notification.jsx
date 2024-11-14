import React from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const Notification = ({ alert }) => {
  if (!alert) return null;

  return (
    <Stack
      sx={{
        width: 'fit-content',
        position: 'fixed',
        top: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        overflow: 'visible',
      }}
      spacing={2}
    >
      <Alert
        severity={alert.severity}
        style={{
          fontSize: '1rem',
          padding: '10px 20px',
          borderRadius: '8px',
          backgroundColor:
            alert.severity === 'success' ? '#185905' :
              alert.severity === 'info' ? '#F2811D' :
                '#F22F1D',
          color: '#FFFFFF',
        }}
      >
        {alert.message}
      </Alert>
    </Stack>
  );
};

export default Notification;
