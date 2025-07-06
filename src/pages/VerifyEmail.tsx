import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';
import {
  Email,
  CheckCircle,
  Refresh,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import apiService from '../services/api';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, isAuthenticated, addNotification, setLoading } = useStore();

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated or already verified
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.isEmailVerified) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (error) setError('');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      const response = await apiService.verifyEmail(otp);
      
      if (response && response.success) {
        addNotification({
          message: 'Email verified successfully!',
          type: 'success',
        });

        // Redirect based on user status
        if (!response.isChangedDefaultPassword) {
          navigate('/change-password');
        } else if (!response.isAgentVerified && response.userRole === 4) {
          navigate('/verify-agent');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid OTP. Please try again.');
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

  const handleResendOtp = async () => {
    setIsResending(true);
    
    try {
      await apiService.sendActivationMail();
      addNotification({
        message: 'OTP sent to your email successfully!',
        type: 'success',
      });
    } catch (error) {
      const errorMessage = apiService.handleError(error);
      addNotification({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!user) return null;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant={isMobile ? "h3" : "h2"} 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Verify Your Email
        </Typography>
        <Typography variant="h6" color="text.secondary">
          We've sent a verification code to {user.email}
        </Typography>
      </Box>

      <Card elevation={4} sx={{ maxWidth: 500, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Email sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please check your email and enter the verification code below
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleVerify} sx={{ mb: 4 }}>
            <TextField
              label="Verification Code"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CheckCircle color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Didn't receive the code?
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleResendOtp}
              disabled={isResending}
              sx={{ mb: 2 }}
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Having trouble? Contact our support team
        </Typography>
      </Box>
    </Container>
  );
};

export default VerifyEmail; 