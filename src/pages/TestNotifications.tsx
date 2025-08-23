import React from 'react';
import { Container, Typography, Button, Box, Card, CardContent } from '@mui/material';
import { useStore } from '../store/useStore';

const TestNotifications: React.FC = () => {
  const { notification } = useStore();

  const testBasicNotification = () => {
    notification.show('This is a basic notification!', 'info');
  };

  const testNotificationShow = () => {
    notification.show('This notification uses the show method!', 'success');
  };

  const testMultipleNotifications = () => {
    notification.show('First notification!', 'info');
    setTimeout(() => notification.show('Second notification!', 'warning'), 1000);
    setTimeout(() => notification.show('Third notification!', 'error'), 2000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Test Notifications
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="contained" onClick={testBasicNotification}>
          Test Basic Notification
        </Button>
        <Button variant="contained" onClick={testNotificationShow}>
          Test Notification Show
        </Button>
        <Button variant="contained" onClick={testMultipleNotifications}>
          Test Multiple Notifications
        </Button>
      </Box>

      <Card sx={{ p: 3, mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Instructions
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>Click the test buttons above</li>
              <li>Look for notifications in the top-right corner</li>
              <li>Notifications should appear and auto-dismiss</li>
            </ol>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestNotifications; 
