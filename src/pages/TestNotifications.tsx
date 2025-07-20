import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useStore } from '../store/useStore';

const TestNotifications: React.FC = () => {
  const { notification, addNotification, notifications } = useStore();

  const testBasicNotification = () => {
    console.log('Testing basic notification...');
    addNotification({
      message: 'This is a test notification',
      type: 'success',
      duration: 5000
    });
  };

  const testNotificationShow = () => {
    console.log('Testing notification.show...');
    notification.show('This is a test from notification.show', 'error');
  };

  const testMultipleNotifications = () => {
    console.log('Testing multiple notifications...');
    addNotification({ message: 'First notification', type: 'success' });
    setTimeout(() => addNotification({ message: 'Second notification', type: 'error' }), 1000);
    setTimeout(() => addNotification({ message: 'Third notification', type: 'warning' }), 2000);
    setTimeout(() => addNotification({ message: 'Fourth notification', type: 'info' }), 3000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Notification System Test
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Testing the notification system to identify why notifications are not showing.
      </Typography>

      {/* Debug Info */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
        <Typography variant="h6" gutterBottom>
          Debug Information
        </Typography>
        <Typography variant="body2">
          Current notifications count: {notifications.length}
        </Typography>
        <Typography variant="body2">
          Notifications: {JSON.stringify(notifications.map(n => ({ id: n.id, message: n.message, type: n.type })))}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={testBasicNotification}
          fullWidth
        >
          Test Basic Notification
        </Button>

        <Button 
          variant="contained" 
          onClick={testNotificationShow}
          fullWidth
        >
          Test notification.show
        </Button>

        <Button 
          variant="contained" 
          onClick={testMultipleNotifications}
          fullWidth
        >
          Test Multiple Notifications
        </Button>
      </Box>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Instructions
        </Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li>Click the test buttons above</li>
            <li>Check the browser console for debug messages</li>
            <li>Look for notifications in the top-right corner</li>
            <li>If notifications don't appear, check the debug info above</li>
          </ol>
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestNotifications; 
