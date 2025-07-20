import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Alert, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Email, Phone, Person, CheckCircle, Pending } from '@mui/icons-material';

const AgentVerification: React.FC = () => {
  const navigate = useNavigate();
  const { user, notification } = useStore();

  const handleContactSupport = () => {
    notification.show('Please contact support at help.wahlotto@gmail.com', 'info');
  };

  const handleGoBack = () => {
            navigate('/my-profile');
  };

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Profile Verification Status
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your agent account verification status
        </Typography>
      </Box>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {user.isAgentVerified ? (
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            ) : (
              <Pending sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
            )}
            
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              STATUS: {user.isAgentVerified ? 'Verified' : 'Not Verified'}
            </Typography>
            
            <Chip 
              label={user.isAgentVerified ? 'Agent Verified' : 'Pending Verification'} 
              color={user.isAgentVerified ? 'success' : 'warning'} 
              size="large"
              sx={{ fontSize: '1.1rem', py: 1 }}
            />
          </Box>

          {!user.isAgentVerified && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Your profile registration request is not verified yet.
              </Typography>
              <Typography variant="body2">
                Please wait for approval from administrator. Make sure the details you have provided are correct. 
                Our Admin will verify your email, phone number and other details.
              </Typography>
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Email color="primary" />
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Chip 
                label={user.isEmailVerified ? 'Verified' : 'Not Verified'} 
                color={user.isEmailVerified ? 'success' : 'error'} 
                size="small"
              />
            </Box>
            
            {user.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone color="primary" />
                <Typography variant="body1">
                  <strong>Phone:</strong> {user.phone}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person color="primary" />
              <Typography variant="body1">
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </Typography>
            </Box>
          </Box>

          {!user.isAgentVerified && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                If you think your details are correct and still not approved by Admin, then please write an email to{' '}
                <Button 
                  variant="text" 
                  color="primary" 
                  onClick={handleContactSupport}
                  sx={{ p: 0, minWidth: 'auto', textDecoration: 'underline' }}
                >
                  help.wahlotto@gmail.com
                </Button>
              </Typography>
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleGoBack}
              size="large"
            >
              Go to My Profile
            </Button>
            
            {!user.isAgentVerified && (
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleContactSupport}
                size="large"
              >
                Contact Support
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AgentVerification; 
