import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
  Alert,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  GroupAdd,
  Person,
  CheckCircle,
  Security,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import apiService from '../services/api';
import type { SignUpRequest } from '../types';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  const [formData, setFormData] = useState<SignUpRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    referredBy: searchParams.get('ref') || '',
  });
  const [age, setAge] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkedRefCode, setCheckedRefCode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'error'>('idle');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
              navigate('/my-profile');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string) => {
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

  const handleAgeChange = (value: string) => {
    setAge(value);
    if (errors.age) {
      setErrors(prev => ({ ...prev, age: '' }));
    }
  };

  const handleCheckboxChange = () => {
    setCheckedRefCode(!checkedRefCode);
    if (checkedRefCode) {
      setFormData(prev => ({ ...prev, referredBy: searchParams.get('ref') || '' }));
    } else {
      setFormData(prev => ({ ...prev, referredBy: '1411851980' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Age validation
    if (!age || Number(age) < 18) {
      newErrors.age = 'You must be at least 18 years old to use this application';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // setLocation({
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude
            // });
          },
          (error) => {
            // Location access denied or unavailable
            // setLocation(null);
          }
        );
      } else {
        // setLocation(null);
      }

      const signUpData = {
        ...formData,
        // latitude, // This line was removed as per the edit hint
        // longitude, // This line was removed as per the edit hint
      };

      const response = await apiService.signUp(signUpData);
      
      if (response.success) {
        // Store authentication data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Update store
        setUser(response.user);
        setToken(response.token);
        setAuthenticated(true);
        
        // Show success notification
        addNotification({
          message: 'Account created successfully! Welcome to WahLotto.',
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
          navigate('/my-profile');
        }
      } else {
        setSubmitStatus('error');
        // Error will be handled by API service and shown as snackbar automatically
      }
    } catch (error) {
      setSubmitStatus('error');
      // Error will be handled by API service and shown as snackbar automatically
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
      }}
    >
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
          Join WahLotto
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Create your account and start playing
        </Typography>
      </Box>

      <Card elevation={4} sx={{ maxWidth: 500, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Sign Up Form */}
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
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => handleAgeChange(e.target.value)}
              error={!!errors.age}
              helperText={errors.age}
              fullWidth
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
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
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Referral Code (Optional)"
              value={formData.referredBy}
              onChange={(e) => handleInputChange('referredBy', e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GroupAdd color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedRefCode}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
              }
              label="Don't have Referral Code"
              sx={{ mb: 3 }}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
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

          {/* Sign In Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>


    </Container>
  );
};

export default SignUp; 
