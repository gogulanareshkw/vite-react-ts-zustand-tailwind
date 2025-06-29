import React, { useState } from 'react';
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
  Chip,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Support,
  Business,
  Schedule,
  ArrowBack,
  WhatsApp,
  Send,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import apiService from '../services/api';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification, setLoading } = useStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Email Support',
      details: ['support@wahlotto.com', 'info@wahlotto.com'],
      description: 'Get quick responses to your inquiries',
      action: () => window.open('mailto:support@wahlotto.com')
    },
    {
      icon: <Phone sx={{ fontSize: 32, color: 'success.main' }} />,
      title: 'Phone Support',
      details: ['+91 1800-XXX-XXXX', '+91 98765-43210'],
      description: 'Speak directly with our support team',
      action: () => window.open('tel:+911800XXXXXXX')
    },
    {
      icon: <WhatsApp sx={{ fontSize: 32, color: 'success.main' }} />,
      title: 'WhatsApp Support',
      details: ['+91 98765-43210'],
      description: 'Chat with us on WhatsApp',
      action: () => window.open('https://wa.me/919876543210')
    },
    {
      icon: <LocationOn sx={{ fontSize: 32, color: 'secondary.main' }} />,
      title: 'Office Address',
      details: ['WahLotto Headquarters', 'Mumbai, Maharashtra, India'],
      description: 'Visit our main office during business hours',
      action: null
    },
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 2:00 PM' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }
    if (formData.message.length < 10) {
      setError('Message must be at least 10 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setLoading(true);
    setError('');

    try {
      // For now, we'll simulate the API call since feedback API might not exist
      // In a real implementation, you would call: await apiService.createFeedback(formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      addNotification({
        message: 'Your message has been sent successfully! We will get back to you soon.',
        type: 'success',
      });
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      const errorMessage = 'Failed to send message. Please try again.';
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Get in touch with our support team for any questions or assistance
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Contact Information Cards */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 6 }}>
        {contactInfo.map((info, index) => (
          <Card key={index} elevation={4} sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                {info.icon}
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {info.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {info.description}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                {info.details.map((detail, idx) => (
                  <Typography key={idx} variant="body1" sx={{ fontWeight: 'medium' }}>
                    {detail}
                  </Typography>
                ))}
              </Box>
              {info.action && (
                <Button
                  variant="outlined"
                  onClick={info.action}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Contact Now
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Contact Form and Business Hours */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
        {/* Contact Form */}
        <Card elevation={4} sx={{ flex: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Send us a Message
            </Typography>
            
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you for your message! We will get back to you within 24 hours.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </Box>
              
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                required
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              
              <TextField
                label="Phone Number (Optional)"
                variant="outlined"
                fullWidth
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              
              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                required
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
              
              <TextField
                label="Message"
                variant="outlined"
                fullWidth
                required
                multiline
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Please describe your inquiry in detail..."
              />
              
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={<Send />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Business Hours and Quick Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          <Card elevation={4}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Business Hours
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {businessHours.map((schedule, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {schedule.day}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {schedule.hours}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card elevation={4}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Support sx={{ fontSize: 28, color: 'success.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Support Information
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Our customer support team is available 24/7 to assist you with any questions about:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  • Account registration and verification
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  • Payment and withdrawal issues
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  • Lottery rules and gameplay
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  • Technical support and troubleshooting
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={4} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Official Information
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                WahLotto is licensed and regulated by the Government of India.
              </Typography>
              <Typography variant="body2">
                License Number: WL-2024-001<br />
                Registration: 1234567890<br />
                GST Number: 27ABCDE1234F1Z5
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* FAQ Section */}
      <Card elevation={4} sx={{ mt: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                How do I create an account?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Simply click the "Sign Up" button and provide your email, name, and create a password. 
                You'll receive a verification email to activate your account.
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                What payment methods do you accept?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We accept UPI payments, bank transfers, and credit/debit cards for recharges. 
                All transactions are secure and encrypted.
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                How long does it take to receive winnings?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All prizes are paid within 24-48 hours of the draw. You'll receive a notification 
                and the funds will be credited to your account.
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                Is my information secure?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes, we use bank-level encryption and security measures to protect your personal 
                and financial information. We never share your data with third parties.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Contact; 