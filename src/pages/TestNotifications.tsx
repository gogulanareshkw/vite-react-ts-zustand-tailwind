import React from 'react';
import { Box, Button, Typography, Paper, Grid } from '@mui/material';
import { useStore } from '../store/useStore';

const TestNotifications: React.FC = () => {
  const { notification, api } = useStore();

  const testNotifications = () => {
    // Test store notification system
    notification.show('Test success message from store', 'success');
    setTimeout(() => notification.show('Test error message from store', 'error'), 1000);
    setTimeout(() => notification.show('Test warning message from store', 'warning'), 2000);
    setTimeout(() => notification.show('Test info message from store', 'info'), 3000);
  };

  const testApiNotifications = () => {
    // Test API notification system
    (api as any).testSuccessNotification('Test success message from API');
    setTimeout(() => (api as any).testErrorNotification('Test error message from API'), 1000);
    setTimeout(() => (api as any).testWarningNotification('Test warning message from API'), 2000);
    setTimeout(() => (api as any).testInfoNotification('Test info message from API'), 3000);
  };

  const testApiError = async () => {
    try {
      // This will trigger an API error that should show as a notification
      await api.getUserInfo('invalid-user-id');
    } catch (error) {
      // Error should be automatically handled by the API service
      console.log('API error caught:', error);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Notification System Test
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Store Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These notifications are triggered directly through the store's notification system.
        </Typography>
        <Button 
          variant="contained" 
          onClick={testNotifications}
          sx={{ mr: 2 }}
        >
          Test Store Notifications
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test API Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These notifications are triggered through the API service's notification system.
        </Typography>
        <Button 
          variant="contained" 
          onClick={testApiNotifications}
          sx={{ mr: 2 }}
        >
          Test API Notifications
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test API Error Handling
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This will trigger an actual API error that should automatically show as a notification.
        </Typography>
        <Button 
          variant="contained" 
          color="error"
          onClick={testApiError}
        >
          Test API Error
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notification Features
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="primary">
              ✅ Automatic Error Display
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All API errors are automatically shown as snackbar notifications
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="primary">
              ✅ Success Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Important operations show success confirmations
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="primary">
              ✅ Auto-dismiss
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Notifications automatically disappear after a set duration
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="primary">
              ✅ Manual Close
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Users can manually close notifications by clicking the X button
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TestNotifications; 