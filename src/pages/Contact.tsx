import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Support,
  Business,
  Schedule,
} from '@mui/icons-material';

const Contact: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Email Support',
      details: ['support@gulflotto.com', 'info@gulflotto.com'],
      description: 'Get quick responses to your inquiries',
    },
    {
      icon: <Phone sx={{ fontSize: 32, color: 'success.main' }} />,
      title: 'Phone Support',
      details: ['+66 2 123 4567', '+66 2 123 4568'],
      description: 'Speak directly with our support team',
    },
    {
      icon: <LocationOn sx={{ fontSize: 32, color: 'secondary.main' }} />,
      title: 'Office Address',
      details: ['123 Lottery Street', 'Bangkok 10400, Thailand'],
      description: 'Visit our main office during business hours',
    },
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 2:00 PM' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
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
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Get in touch with our support team for any questions or assistance
        </Typography>
      </Box>

      {/* Contact Information Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 6 }}>
        {contactInfo.map((info, index) => (
          <Card key={index} elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ mb: 2 }}>
              {info.icon}
            </Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {info.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {info.description}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {info.details.map((detail, idx) => (
                <Typography key={idx} variant="body1" sx={{ fontWeight: 'medium' }}>
                  {detail}
                </Typography>
              ))}
            </Box>
          </Card>
        ))}
      </Box>

      {/* Contact Form and Business Hours */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
        {/* Contact Form */}
        <Card elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Send us a Message
          </Typography>
          
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                required
              />
            </Box>
            
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              required
              type="email"
            />
            
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              type="tel"
            />
            
            <TextField
              label="Subject"
              variant="outlined"
              fullWidth
              required
            />
            
            <TextField
              label="Message"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={4}
            />
            
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Send Message
            </Button>
          </Box>
        </Card>

        {/* Business Hours and Quick Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card elevation={3} sx={{ p: 3 }}>
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
          </Card>

          <Card elevation={3} sx={{ p: 3 }}>
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
          </Card>

          <Card elevation={3} sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Business sx={{ fontSize: 28, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Official Information
              </Typography>
            </Box>
            <Typography variant="body2" paragraph>
              GulfLotto is licensed and regulated by the Government Lottery Office of Thailand.
            </Typography>
            <Typography variant="body2">
              License Number: GLO-2024-001<br />
              Registration: 1234567890
            </Typography>
          </Card>
        </Box>
      </Box>

      {/* FAQ Section */}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Frequently Asked Questions
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
              How do I create an account?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Simply click the "Sign Up" button and provide your email, name, and create a password. 
              You'll receive a verification email to activate your account.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
              What payment methods do you accept?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We accept credit cards, debit cards, bank transfers, and popular digital wallets 
              including PayPal, Alipay, and WeChat Pay.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
              How long does it take to receive winnings?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All prizes are paid within 24 hours of the draw. You'll receive a notification 
              and the funds will be credited to your account immediately.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
              Is my information secure?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Yes, we use bank-level encryption and security measures to protect your personal 
              and financial information. We never share your data with third parties.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Contact; 