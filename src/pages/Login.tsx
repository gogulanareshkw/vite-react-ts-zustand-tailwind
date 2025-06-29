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
  Paper,
  Alert,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  Google,
  Facebook,
  Apple,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import apiService from '../services/api';
import type { LoginRequest } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Store actions
  const { 
    setUser, 
    setToken, 
    setAuthenticated, 
    setLoading, 
    addNotification,
    isAuthenticated 
  } = useStore();

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'error'>('idle');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear submit status when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitStatus('idle');
    setLoading(true);

    try {
      const response = await apiService.login(formData);
      
      // Store authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update store
      setUser(response.user);
      setToken(response.token);
      setAuthenticated(true);
      
      // Show success notification
      addNotification({
        message: 'Login successful! Welcome back.',
        type: 'success',
      });

      // Redirect based on user verification status
      if (!response.user.isEmailVerified) {
        navigate('/verify-email');
      } else if (!response.user.isChangedDefaultPassword) {
        navigate('/change-password');
      } else if (!response.user.isAgentVerified && response.user.userRole === 4) {
        navigate('/verify-agent');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setSubmitStatus('error');
      const errorMessage = apiService.handleError(error);
      addNotification({
        message: errorMessage,
        type: 'error',
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    addNotification({
      message: `${provider} login is not available yet. Please use email/password login.`,
      type: 'info',
    });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

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
          Welcome Back
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Sign in to your WahLotto account
        </Typography>
      </Box>

      <Card elevation={4} sx={{ maxWidth: 500, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Error Message */}
          {submitStatus === 'error' && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Invalid email or password. Please try again.
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <TextField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    disabled
                  />
                }
                label="Remember me"
              />
              <MuiLink
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{ cursor: 'pointer' }}
              >
                Forgot password?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              endIcon={<LoginIcon />}
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Social Login Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Google />}
              onClick={() => handleSocialLogin('Google')}
              sx={{ 
                py: 1.5,
                borderColor: '#db4437',
                color: '#db4437',
                '&:hover': {
                  borderColor: '#c23321',
                  backgroundColor: 'rgba(219, 68, 55, 0.04)',
                },
              }}
            >
              Continue with Google
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<Facebook />}
              onClick={() => handleSocialLogin('Facebook')}
              sx={{ 
                py: 1.5,
                borderColor: '#4267B2',
                color: '#4267B2',
                '&:hover': {
                  borderColor: '#365899',
                  backgroundColor: 'rgba(66, 103, 178, 0.04)',
                },
              }}
            >
              Continue with Facebook
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<Apple />}
              onClick={() => handleSocialLogin('Apple')}
              sx={{ 
                py: 1.5,
                borderColor: '#000000',
                color: '#000000',
                '&:hover': {
                  borderColor: '#333333',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Continue with Apple
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Sign Up Link */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            Sign Up
          </Link>
        </Typography>
      </Box>

      {/* Security Notice */}
      <Paper elevation={1} sx={{ p: 3, mt: 4, background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4caf50' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
          🔒 Secure Login
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your account is protected with bank-level security. All login attempts are monitored 
          and verified to ensure your account remains secure.
        </Typography>
      </Paper>

      {/* Features Highlight */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mt: 4 }}>
        <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            🎯 Quick Access
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Instant access to your account
          </Typography>
        </Paper>
        <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            💰 Check Winnings
          </Typography>
          <Typography variant="caption" color="text.secondary">
            View your lottery results
          </Typography>
        </Paper>
        <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            🎮 Play Games
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Buy tickets and play
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 