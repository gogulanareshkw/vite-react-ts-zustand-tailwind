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
  IconButton,
} from '@mui/material';
import {
  Email,
  CheckCircle,
  Refresh,
  Visibility,
  VisibilityOff,
  Security,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import apiService from '../services/api';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, isAuthenticated, addNotification, setLoading, notification } = useStore();

  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
    if (validationErrors.otp) {
      setValidationErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!otp.trim()) {
      errors.otp = 'Please enter the OTP';
    } else if (otp.length !== 6) {
      errors.otp = 'OTP must be 6 digits';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      const response = await apiService.verifyEmail(otp);
      
      if (response.success) {
        notification.show('Email verified successfully!', 'success');
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Error will be handled by API service and shown as snackbar
      console.error('Email verification error:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setLoading(true);

    try {
      const response = await apiService.sendActivationMail();
      
      if (response.success) {
        notification.show('OTP sent successfully!', 'success');
      }
    } catch (error: any) {
      // Error will be handled by API service and shown as snackbar
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
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

          <form onSubmit={handleVerifyOtp}>
            <TextField
              fullWidth
              label="Enter OTP"
              type={showOtp ? 'text' : 'password'}
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              error={!!validationErrors.otp}
              helperText={validationErrors.otp}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowOtp(!showOtp)}
                      edge="end"
                    >
                      {showOtp ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Didn't receive the code?
            </Typography>
            <Button
              variant="text"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              Resend OTP
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