import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, TextField, Button, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import apiService from '../services/api';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addNotification, setLoading } = useStore();
  
  const [formData, setFormData] = useState({
    OTP: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const userId = searchParams.get('userId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.OTP || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!userId) {
      setError('Invalid reset link');
      return;
    }

    setIsLoading(true);
    setLoading(true);
    setError('');

    try {
      const response = await apiService.resetPassword(userId, formData.OTP, formData.newPassword);
      
      if (response.success) {
        setSuccess(true);
        addNotification({
          message: 'Password reset successfully!',
          type: 'success',
        });
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (error) {
      const errorMessage = apiService.handleError(error);
      setError(errorMessage);
      addNotification({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Reset Password
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Enter your new password
        </Typography>
      </Box>

      <Card elevation={4} sx={{ maxWidth: 500, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          {success ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset successfully!
              </Alert>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
              >
                Go to Login
              </Button>
            </Box>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <TextField
                  label="OTP Code"
                  value={formData.OTP}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, OTP: e.target.value }));
                    if (error) setError('');
                  }}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="New Password"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, newPassword: e.target.value }));
                    if (error) setError('');
                  }}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                    if (error) setError('');
                  }}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Remember your password?{' '}
                  <Link to="/login" style={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ResetPassword; 