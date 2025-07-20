import React from 'react';
import { Box, Paper, Typography, IconButton, Alert, AlertTitle } from '@mui/material';
import { Close as CloseIcon, CheckCircle, Error, Warning, Info } from '@mui/icons-material';
import { useStore } from '../store/useStore';

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useStore();

  if (notifications.length === 0) return null;

  const getSeverity = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      case 'warning': return <Warning />;
      case 'info': return <Info />;
      default: return <Info />;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        maxWidth: 400,
      }}
    >
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          severity={getSeverity(notification.type)}
          icon={getIcon(notification.type)}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => removeNotification(notification.id)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            minWidth: 300,
            boxShadow: 3,
            '& .MuiAlert-message': {
              flex: 1,
            },
          }}
        >
          <Typography variant="body2">
            {notification.message}
          </Typography>
        </Alert>
      ))}
    </Box>
  );
};

export default Notification; 
